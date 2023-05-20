import { Builder } from '../src/index';

interface Testing {
  a: number;
  b: string;
  c: boolean;
  d?: number;
}

class TestingClass implements Testing {
  public a!: number;
  public b!: string;
  public c!: boolean;
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

  it('should build a class', () => {
    const builder = Builder(TestingClass)
        .a(10)
        .b('abc')
        .c(true);

    const result = builder.build();
    expect(result).toEqual({
      a: 10,
      b: 'abc',
      c: true
    });
    expect(result).toBeInstanceOf(TestingClass);
  });

  it('might build broken objects if you do not pay attention', () => {
    const builder = Builder<Testing>().a(10);

    // Note that the builder does not check that all
    // mandatory fields have been set, and returns an
    // object not matching the type
    const built = builder.build();

    expect(built).toEqual({
      a: 10,
      b: undefined,
      c: undefined
    });
  });

  it('will set methods as required', () => {
    // Note that d is optional, however it's set method is not
    const builder = Builder<Testing>()
        .a(10)
        .b('abc')
        .c(true)
        .d(20);
    const result = builder.build();

    expect(result).toEqual({
      a: 10,
      b: 'abc',
      c: true,
      d: 20
    });
  });

  it("won't build broken classes", () => {
    const builder = Builder(TestingClass).a(10);
    const built = builder.build();
    expect(built).toEqual({
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

    it('should build a modified class template', () => {
      const template: Testing = {
        a: 10,
        b: 'abc',
        c: true
      };

      const builder = Builder(TestingClass, template)
          .a(42);

      const result = builder.build();
      expect(result).toEqual({
        a: 42,
        b: 'abc',
        c: true
      });
      expect(result).toBeInstanceOf(TestingClass);
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

    it('should not modify the template class', () => {
      const template: TestingClass = new TestingClass();
      template.a = 10;
      template.b = 'abc';
      template.c = true;

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

  it('if no arguments passed return current value.', () => {
    // Note that d is optional, however it's set method is not
    const builder = Builder<Testing>();

    expect(builder.a()).toBeUndefined();
    builder.a(10);
    expect(builder.a()).toEqual(10);

    expect(builder.d()).toBeUndefined();
    
    expect(builder.d()).toBeUndefined();
    builder.d(20);
    expect(builder.d()).toEqual(20);

    builder.b('abc');
    builder.c(true);

    const result = builder.build();

    expect(result).toEqual({
      a: 10,
      b: 'abc',
      c: true,
      d: 20
    });
  });

  it('override values', () => {
    const builder = Builder<Testing>(null, {a: 20, c: false})
      .a(10)
      .b('abc')
      .c(true);

    expect(builder.build()).toEqual({
      a: 20,
      b: 'abc',
      c: false
    });
  });
});
