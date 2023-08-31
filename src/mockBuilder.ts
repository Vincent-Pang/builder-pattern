export type IBuilder<T> = {
  [k in keyof T]-?: (arg: T[k]) => IBuilder<T>;
} & {
  build(): T;
};

type Clazz<T> = new (...args: unknown[]) => T;

/**
 * Create a Builder for a class. Returned objects will be of the class type.
 *
 * e.g. let obj: MyClass = Builder(MyClass).setA(5).setB("str").build();
 *
 * @param type - the name of the class to instantiate.
 * @param template - optional class partial which the builder will derive initial params from.
 */
export function mockBuilder<T>(
  type: Clazz<T>,
  template?: Partial<T> | null,
): IBuilder<T>;

/**
 * Create a Builder for an interface. Returned objects will be untyped.
 *
 * e.g. let obj: Interface = Builder<Interface>().setA(5).setB("str").build();
 *
 * @param template - optional partial object which the builder will derive initial params from.
 */
export function mockBuilder<T>(template?: Partial<T> | null): IBuilder<T>;

export function mockBuilder<T>(
  typeOrTemplate?: Clazz<T> | Partial<T> | null,
  templateOrOverride?: Partial<T> | null,
): IBuilder<T> {
  let Type: Clazz<T> | undefined;
  let template: Partial<T> | null | undefined;

  if (typeOrTemplate instanceof Function) {
    Type = typeOrTemplate;
    template = templateOrOverride;
  } else {
    template = typeOrTemplate;
  }

  const built: Record<string, unknown> = template
    ? Object.assign({}, template)
    : {};

  const builder = new Proxy(
    {},
    {
      get(target, prop) {
        if (prop === 'build') {
          if (Type) {
            // A class name (identified by the constructor) was passed. Instantiate it with props.
            const obj: T = new Type();
            return () =>
              Object.assign(obj as T & Record<string, unknown>, { ...built });
          }
          // No type information - just return the object.
          return () => built;
        }

        return (...args: unknown[]): unknown => {
          const updatedFields = { ...built, [prop.toString()]: args[0] };

          if (Type) {
            // A class name (identified by the constructor) was passed. Instantiate it with props.
            return mockBuilder(Type, updatedFields as Partial<T>);
          }

          return mockBuilder(updatedFields);
        };
      },
    },
  );

  return builder as IBuilder<T>;
}
