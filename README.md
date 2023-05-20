# builder-pattern

Create a builder pattern for Typescript using ES6 proxy.

## Installation

```
yarn add builder-pattern
```

## Usage

### Basic usage
```typescript
interface UserInfo {
  id: number;
  userName: string;
  email: string;
}

const userInfo = Builder<UserInfo>()
                   .id(1)
                   .userName('foo')
                   .email('foo@bar.baz')
                   .build();
```
To get value from existing builder, just call the method without parameter, current value will be returned.
```typescript
const builder = Builder<UserInfo>();

builder.id(1);
console.log(builder.id());        // 1

console.log(builder.userName());  // undefined
builder.userName('foo');
console.log(builder.userName());  // foo

const userInfo = builder.build();
```

A note of caution: when building objects from scratch, the builder currently cannot ensure that all
mandatory fields have been set. The built object might thus violate the contract of the given interface.
For example, the following will compile (see also the example in the tests):

```typescript
const brokenUserInfo = Builder<UserInfo>()
                         .build();
```
A way around this is to use template objects (see Usage with template objects).

Another way is to use StrictBuilder (see Usage with StrictBuilder).

### Usage with template objects

You can also specify a template object, which allows easy creation of variation of objects.
This is especially useful for making test data setup more readable:

```typescript
const defaultUserInfo: UserInfo = {
  id: 1,
  userName: 'foo',
  email: 'foo@bar.baz'
};

const modifiedUserInfo = Builder(defaultUserInfo)
                          .id(2)
                          .build();
```
Notes:
- With this approach, if the template object conforms to the interface, the
built object will, too.
- The builder will effectively create and modify a shallow copy of the template object.

### Usage with class object

You can also specify a class object.

```typescript
class UserInfo {
  id!: number;
  userName!: string;
  email!: string;
}

const userInfo = Builder(UserInfo)  // note that ( ) is used instead of < > here
                   .id(1)
                   .userName('foo')
                   .email('foo@bar.baz')
                   .build();

```

Moreover, you can also specify a class object with a template object.

```typescript
class UserInfo {
  id!: number;
  userName!: string;
  email!: string;
}

const userInfo = Builder(UserInfo, {id: 1, userName: 'foo'})
                   .userName:('foo bar')
                   .email('foo@bar.baz')
                   .build();

```

### Usage with override objects
You can specify a override object, which allows override values when calling build().
This is useful for some cases:

```typescript
const overrideUserInfo: Partial<UserInfo> = {
  email: 'testing@bar.baz'
};

const userInfo = Builder(null, overrideUserInfo)
                   .id(1)
                   .userName('foo')
                   .email('foo@bar.baz')
                   .build();  // email will be overrided when calling build()
                   
console.log(userInfo);  // { id: 1, userName: 'foo', email: 'testing@bar.baz' }
```

### Usage with StrictBuilder

`StrictBuilder` is used to make sure all variables are initialized.

```typescript
interface UserInfo {
  id: number;
  userName: string;
  email: string;
}

const userInfo = StrictBuilder<UserInfo>()
                   .id(1)
                   .build(); // This expression is not callable.
                             // Type 'never' has no call signatures.ts(2349)
```

All variables must be initialized before calling `build()`.

```typescript
const userInfo = StrictBuilder<UserInfo>()
                   .id(1)
                   .userName('foo')
                   .email('foo@bar.baz')
                   .build();  // build() is called successfully
```

Notes:
`StrictBuilder` does not support template object nor class.

### Usage with makeSecure

`makeSecure` is used to make sure all variables are initialized correctly, otherwise we should expect an exception.

```typescript
  class MyClass {
    public property1!: string;
    public property2!: string;
 
    public static readonly builder = () => makeSecure(Builder(MyClass), (v) => {
      if (v.property1 && v.property2) return;
      throw new Error('Invalid state');
    });
  }

  MyClass.builder().property1('1').build(); // will throw
  MyClass.builder().property1('1').property2('2').build(); // ok
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

The idea is by unional and jcalz.
Please refer to the [stackoverflow question](https://stackoverflow.com/questions/45291644/builder-pattern-using-typescript-interfaces).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
