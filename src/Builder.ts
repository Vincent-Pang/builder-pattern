export type IBuilder<T> = {
  [k in keyof T]-?: ((arg: T[k]) => IBuilder<T>) & (() => T[k]);
}
& {
  build(): T;
};

type Clazz<T> = new(...args: unknown[]) => T;

/**
 * Create a Builder for a class. Returned objects will be of the class type.
 *
 * e.g. let obj: MyClass = Builder(MyClass).setA(5).setB("str").build();
 *
 * @param type the name of the class to instantiate.
 * @param template optional class partial which the builder will derive initial params from.
 * @param override optional class partial which the builder will override params from when calling build().
 */
export function Builder<T>(type: Clazz<T>, template?: Partial<T> | null, override?: Partial<T> | null): IBuilder<T>;

/**
 * Create a Builder for an interface. Returned objects will be untyped.
 *
 * e.g. let obj: Interface = Builder<Interface>().setA(5).setB("str").build();
 *
 * @param template optional partial object which the builder will derive initial params from.
 * @param override optional partial object which the builder will override params from when calling build().
 */
export function Builder<T>(template?: Partial<T> | null, override?: Partial<T> | null): IBuilder<T>;

export function Builder<T>(typeOrTemplate?: Clazz<T> | Partial<T> | null,
                           templateOrOverride?: Partial<T> | null,
                           override?: Partial<T> | null): IBuilder<T> {
  let type: Clazz<T> | undefined;
  let template: Partial<T> | null | undefined;
  let overrideValues: Partial<T> | null | undefined;

  if (typeOrTemplate instanceof Function) {
    type = typeOrTemplate;
    template = templateOrOverride;
    overrideValues = override;
  } else {
    template = typeOrTemplate;
    overrideValues = templateOrOverride;
  }

  const built: Record<string, unknown> = template ? Object.assign({}, template) : {};

  const builder = new Proxy(
    {},
    {
      get(target, prop) {
        if ('build' === prop) {
          if (overrideValues) {
            Object.assign(built, overrideValues);
          }

          if (type) {
            // A class name (identified by the constructor) was passed. Instantiate it with props.
            const obj: T = new type();
            return () => Object.assign(obj as T & Record<string, unknown>, {...built});
          } else {
            // No type information - just return the object.
            return () => built;
          }
        }

        return (...args: unknown[]): unknown => {
          // If no arguments passed return current value.
          if (0 === args.length) {
            return built[prop.toString()];
          }
          
          built[prop.toString()] = args[0];
          return builder;
        };
      }
    }
  );

  return builder as IBuilder<T>;
}
