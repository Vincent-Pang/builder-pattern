import { Builder } from '../src/index';

interface Testing {
  a: number;
  b: string;
  c: boolean;
}

describe('Builder', () => {
  it('should build', () => {
    const builder = Builder<Testing>()
      .a(10)
      .b('abc')
      .c(true);

    expect(builder.build()).toEqual({
      a: 10,
      b: 'abc',
      c: true
    });
  });

  it('might build broken objects if you do not pay attention', () => {
    const builder = Builder<Testing>().a(10);

    // Note that the builder does not check that all
    // mandatory fields have been set, and returns an
    // object not matching the type
    const built = builder.build();

    expect(builder.build()).toEqual({
      a: 10,
      b: undefined,
      c: undefined
    });
  });

  describe('with template object', () => {
    it('should build the template object', () => {
      const template: Testing = {
        a: 10,
        b: 'abc',
        c: true
      };

      const builder = Builder(template);

      expect(builder.build()).toEqual(template);
    });

    it('should build a modified template object', () => {
      const template: Testing = {
        a: 10,
        b: 'abc',
        c: true
      };

      const builder = Builder(template)
        .a(42);

      expect(builder.build()).toEqual({
        a: 42,
        b: 'abc',
        c: true
      });
    });

    it('should not modify the template object', () => {
      const template: Testing = {
        a: 10,
        b: 'abc',
        c: true
      };

      Builder(template)
        .a(42)
        .build();

      expect(template).toEqual({
        a: 10,
        b: 'abc',
        c: true
      });
    });

  });
});
