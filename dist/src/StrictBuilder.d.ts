export declare type IStrictBuilder<T, B = Record<string, unknown>> = {
    [k in keyof T]-?: (arg: T[k]) => IStrictBuilder<T, B & Record<k, T[k]>>;
} & {
    build: B extends T ? () => T : never;
};
/**
 * Create a StrictBuilder for an interface. Returned objects will be untyped.
 *
 * e.g. let obj: Interface = StrictBuilder<Interface>().setA(5).setB("str").build();
 *
 */
export declare function StrictBuilder<T>(): IStrictBuilder<T>;
