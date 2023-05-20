import type { IBuilder } from './Builder';

/**
 *
 * @description Create a proxy for the IBuilder type to inspect the built object.
 * 
 * @example
 * class MyClass {
 *  public property1!: string;
 *  public property2!: string;
 * 
 *  public static readonly builder = () => makeSecure(Builder(MyClass), (v) => {
 *      if (v.property1 && v.property2) return;
 *      throw new Error('Invalid state');
 *  });
 * }
 * 
 * MyClass.builder().property1('1').build(); // will throw
 * MyClass.builder().property1('1').property2('2').build(); // ok
 */
export function makeSecure<T extends object>(builder: IBuilder<T>, validateOrThrow: (v: T) => void) {
    const proxy = new Proxy(builder, {
        get(target, p, receiver) {
            const original: unknown = Reflect.get(target, p, receiver);

            if (typeof original !== 'function') return original;

            if (p !== 'build') return (...args: unknown[]) => {
                const result: unknown = Reflect.apply(original, target, args);
                if (result === builder) return proxy;

                return result;
            }
            
            return (...args: unknown[]) => {
                const instance = Reflect.apply(original, target, args) as T;
                validateOrThrow(instance);

                return instance;
            }
        },
    });

    return proxy;
}