import { mockBuilder } from './index';

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
    const builder = mockBuilder<Testing>().a(10).b('abc').c(true);

    expect(builder.build()).toEqual({
      a: 10,
      b: 'abc',
      c: true,
    });
  });

  it('should build a class', () => {
    const builder = mockBuilder(TestingClass).a(10).b('abc').c(true);

    const result = builder.build();
    expect(result).toEqual({
      a: 10,
      b: 'abc',
      c: true,
    });

    expect(result).toBeInstanceOf(TestingClass);
  });

  it('might build broken objects if you do not pay attention', () => {
    const builder = mockBuilder<Testing>().a(10);

    // Note that the builder does not check that all
    // mandatory fields have been set, and returns an
    // object not matching the type
    const built = builder.build();

    expect(built).toEqual({
      a: 10,
      b: undefined,
      c: undefined,
    });
  });

  it('will set methods as required', () => {
    // Note that d is optional, however it's set method is not
    const builder = mockBuilder<Testing>().a(10).b('abc').c(true).d(20);
    const result = builder.build();

    expect(result).toEqual({
      a: 10,
      b: 'abc',
      c: true,
      d: 20,
    });
  });

  it("won't build broken classes", () => {
    const builder = mockBuilder(TestingClass).a(10);
    const built = builder.build();
    expect(built).toEqual({
      a: 10,
      b: undefined,
      c: undefined,
    });
  });

  describe('with template object', () => {
    it('should build the template object', () => {
      const template: Testing = {
        a: 10,
        b: 'abc',
        c: true,
      };

      const builder = mockBuilder(template);

      expect(builder.build()).toEqual(template);
    });

    it('should build a modified template object', () => {
      const template: Testing = {
        a: 10,
        b: 'abc',
        c: true,
      };

      const builder = mockBuilder(template).a(42);

      expect(builder.build()).toEqual({
        a: 42,
        b: 'abc',
        c: true,
      });
    });

    it('should build a modified class template', () => {
      const template: Testing = {
        a: 10,
        b: 'abc',
        c: true,
      };

      const builder = mockBuilder(TestingClass, template).a(42);

      const result = builder.build();
      expect(result).toEqual({
        a: 42,
        b: 'abc',
        c: true,
      });
      expect(result).toBeInstanceOf(TestingClass);
    });

    it('should not modify the template object', () => {
      const template: Testing = {
        a: 10,
        b: 'abc',
        c: true,
      };

      mockBuilder(template).a(42).build();

      expect(template).toEqual({
        a: 10,
        b: 'abc',
        c: true,
      });
    });

    it('should not modify the template class', () => {
      const template: TestingClass = new TestingClass();
      template.a = 10;
      template.b = 'abc';
      template.c = true;

      mockBuilder(template).a(42).build();

      expect(template).toEqual({
        a: 10,
        b: 'abc',
        c: true,
      });
    });
  });

  it('preserves the state of a previous builder when modifying a builder', () => {
    type Product = { type: 'foo' | 'bar' };
    const builder = mockBuilder<Product>();

    const baseObject = builder.type('foo');

    const testObject = baseObject.type('bar');

    expect(baseObject.build()).toEqual({ type: 'foo' });
    expect(testObject.build()).toEqual({ type: 'bar' });
  });
});
