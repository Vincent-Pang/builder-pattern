export declare type IBuilder<T> = {
    [k in keyof T]-?: (arg: T[k]) => IBuilder<T>;
} & {
    build(): T;
};
declare type Clazz<T> = new (...args: unknown[]) => T;
/**
 * Create a Builder for a class. Returned objects will be of the class type.
 *
 * e.g. let obj: MyClass = Builder(MyClass).setA(5).setB("str").build();
 *
 * @param type the name of the class to instantiate.
 * @param template optional class partial which the builder will derive initial params from.
 */
export declare function Builder<T>(type: Clazz<T>, template?: Partial<T>): IBuilder<T>;
/**
 * Create a Builder for an interface. Returned objects will be untyped.
 *
 * e.g. let obj: Interface = Builder<Interface>().setA(5).setB("str").build();
 *
 * @param template optional partial object which the builder will derive initial params from.
 */
export declare function Builder<T>(template?: Partial<T>): IBuilder<T>;
export {};
