export type IBuilder<T> = {
  [k in keyof T]-?: (arg: T[k]) => IBuilder<T>
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
 */
export function Builder<T>(type: Clazz<T>, template?: Partial<T>): IBuilder<T>;

/**
 * Create a Builder for an interface. Returned objects will be untyped.
 *
 * e.g. let obj: Interface = Builder<Interface>().setA(5).setB("str").build();
 *
 * @param template optional partial object which the builder will derive initial params from.
 */
export function Builder<T>(template?: Partial<T>): IBuilder<T>;

export function Builder<T>(typeOrTemplate?: Clazz<T> | Partial<T>,
                           template?: Partial<T>): IBuilder<T> {
  let type: Clazz<T> | undefined;
  if (typeOrTemplate instanceof Function) {
    type = typeOrTemplate;
  } else {
    template = typeOrTemplate;
  }

  const built: Record<string, unknown> = template ? Object.assign({}, template) : {};

  const builder = new Proxy(
    {},
    {
      get(target, prop) {
        if ('build' === prop) {
          if (type) {
            // A class name (identified by the constructor) was passed. Instantiate it with props.
            const obj: T = new type();
            return () => Object.assign(obj, {...built});
          } else {
            // No type information - just return the object.
            return () => built;
          }
        }

        return (x: unknown): unknown => {
          built[prop.toString()] = x;
          return builder;
        };
      }
    }
  );

  return builder as IBuilder<T>;
}
