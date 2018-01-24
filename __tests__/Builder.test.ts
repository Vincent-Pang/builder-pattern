import {Builder} from '../src/index';

describe('Test Builder.ts', () => {
  test('test builder', () => {
    interface Testing {
      a: number;
      b: string;
      c: boolean;
    }

    const obj: Readonly<Testing> = Builder<Testing>()
      .a(10)
      .b('abc')
      .build();

    expect(obj.a).toBe(10)
    expect(obj.b).toBe('abc');
    expect(obj.c).toBeUndefined();
  });
});
