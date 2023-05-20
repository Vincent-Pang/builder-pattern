import { Builder } from "../src/Builder";
import { makeSecure } from "../src/makeSecure";

describe('makeSecure', () => {
    const errorMsg = 'Invalid state';

    const cls = class MyClass {
        public property1!: string;
        public property2!: string;

        public static readonly builder = () => makeSecure(Builder(MyClass), (v) => {
            if (v.property1 && v.property2) return;
            throw new Error(errorMsg);
        });
    } 

    it('makeSecure return own proxy', () => {
        const originalBuilder = Builder(cls);
        const proxyBuilder = makeSecure(originalBuilder, (v) => {
            if (v.property1 && v.property2) return;
            throw new Error(errorMsg);
        });

        expect(proxyBuilder.property1('') === proxyBuilder).toBeTruthy()
    })

    it('makeSecure return property if called is function', () => {
        expect(cls.builder().property1('1').property1()).toEqual('1')
    })

    it('throw case', () => {
        expect(() => cls.builder().property1('1').build()).toThrow(errorMsg);
    })

    it('success case', () => {
        expect(cls.builder().property1('1').property2('2').build()).toEqual({
            property1: '1',
            property2: '2',
        });
    })
})