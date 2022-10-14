export type IStrictBuilder<T, B = Record<string, unknown>> = {
  [k in keyof T]-?: ((arg: T[k]) => IStrictBuilder<T, B & Record<k, T[k]>>) & (() => T[k]);
}
& {
  build: B extends T ? () => T : never
};

/**
 * Create a StrictBuilder for an interface. Returned objects will be untyped.
 *
 * e.g. let obj: Interface = StrictBuilder<Interface>().setA(5).setB("str").build();
 *
 */
export function StrictBuilder<T>(): IStrictBuilder<T> {

  const built: Record<string, unknown> = {};

  const strictbuilder = new Proxy(
    {},
    {
      get(target, prop) {
        if ('build' === prop) {
          return () => built;
        }

        return (...args: unknown[]): unknown => {
          // If no arguments passed return current value.
          if (0 === args.length) {
            return built[prop.toString()];
          }
          
          built[prop.toString()] = args[0];
          return strictbuilder as IStrictBuilder<T>;
        };
      }
    }
  );

  return strictbuilder as IStrictBuilder<T>;
}
