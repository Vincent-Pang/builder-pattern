export type IBuilder<T> = {
  [k in keyof T]: (arg: T[k]) => IBuilder<T>
}
& {
  build(): T
};

export function Builder<T>(): IBuilder<T> {
  const built: any = {};

  const builder = new Proxy(
    {},
    {
      get(target, prop, receiver) {
        if ('build' === prop) {
          return () => built;
        }

        return (x: any): any => {
          built[prop] = x;
          return builder;
        };
      }
    }
  );

  return builder as any;
}
