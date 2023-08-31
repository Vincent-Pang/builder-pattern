export type IStrictBuilder<T, B = Record<string, unknown>> = {
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
export function strictMockBuilder<T>(template?: Partial<T>): IStrictBuilder<T> {
  const built: Record<string, unknown> = template
    ? Object.assign({}, template)
    : {};

  const strictbuilder = new Proxy(
    {},
    {
      get(target, prop) {
        if (prop === 'build') {
          return () => built;
        }

        return (...args: unknown[]): unknown => {
          const updatedFields = { ...built, [prop.toString()]: args[0] };
          return strictMockBuilder(updatedFields);
        };
      },
    },
  );

  return strictbuilder as IStrictBuilder<T>;
}
