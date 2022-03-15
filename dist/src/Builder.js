export function Builder(typeOrTemplate, template) {
    let type;
    if (typeOrTemplate instanceof Function) {
        type = typeOrTemplate;
    }
    else {
        template = typeOrTemplate;
    }
    const built = template ? Object.assign({}, template) : {};
    const builder = new Proxy({}, {
        get(target, prop) {
            if ('build' === prop) {
                if (type) {
                    // A class name (identified by the constructor) was passed. Instantiate it with props.
                    const obj = new type();
                    return () => Object.assign(obj, Object.assign({}, built));
                }
                else {
                    // No type information - just return the object.
                    return () => built;
                }
            }
            return (x) => {
                built[prop.toString()] = x;
                return builder;
            };
        }
    });
    return builder;
}
//# sourceMappingURL=Builder.js.map