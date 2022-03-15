/**
 * Create a StrictBuilder for an interface. Returned objects will be untyped.
 *
 * e.g. let obj: Interface = StrictBuilder<Interface>().setA(5).setB("str").build();
 *
 */
export function StrictBuilder() {
    const built = {};
    const Strictbuilder = new Proxy({}, {
        get(target, prop) {
            if ('build' === prop) {
                return () => built;
            }
            return (x) => {
                built[prop.toString()] = x;
                return Strictbuilder;
            };
        }
    });
    return Strictbuilder;
}
//# sourceMappingURL=StrictBuilder.js.map