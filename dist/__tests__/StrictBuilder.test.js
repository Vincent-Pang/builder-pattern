import { StrictBuilder } from '../src/index';
describe('StrictBuilder', () => {
    it('should build', () => {
        const strictBuilder = StrictBuilder()
            .a(10)
            .b('abc')
            .c(true);
        expect(strictBuilder.build()).toEqual({
            a: 10,
            b: 'abc',
            c: true
        });
    });
    it('will set methods as required', () => {
        // Note that d is optional, however it's set method is not
        const strictBuilder = StrictBuilder()
            .a(10)
            .b('abc')
            .c(true)
            .d(20);
        const result = strictBuilder.build();
        expect(result).toEqual({
            a: 10,
            b: 'abc',
            c: true,
            d: 20
        });
    });
});
//# sourceMappingURL=StrictBuilder.test.js.map