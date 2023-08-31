# mock-builder

Create reusable mocks using the builder pattern in Typescript

## Installation

```
yarn add mock-builder
```

## Usage

### Basic usage

```typescript
interface UserInfo {
  id: number;
  userName: string;
  email: string;
}

const userInfo = mockBuilder<UserInfo>()
  .id(1)
  .userName('foo')
  .email('foo@bar.baz')
  .build();
```

A note of caution: when building objects from scratch, the builder currently cannot ensure that all
mandatory fields have been set. The built object might thus violate the contract of the given interface.
For example, the following will compile (see also the example in the tests):

```typescript
const brokenUserInfo = mockBuilder<UserInfo>().build();
```

A way around this is to use template objects (see Usage with template objects).

Another way is to use strictMockBuilder (see Usage with strictMockBuilder).

### Reusing builder instances

```typescript
const baseUserInfo = mockBuilder<UserInfo>()
  .id(1)
  .userName('foo')
  .email('foo@bar.baz');

const userInfo = baseUserInfo.id(2).build();
// {
//   id: 2,
//   userName: "foo",
//   email: "foo@bar.baz"
// }

const otherUserInfo = baseUserInfo.id(3).build();
// {
//   id: 3,
//   userName: "foo",
//   email: "foo@bar.baz"
// }
```

### Usage with template objects

You can also specify a template object, which allows easy creation of variation of objects.
This is especially useful for making test data setup more readable:

```typescript
const defaultUserInfo: UserInfo = {
  id: 1,
  userName: 'foo',
  email: 'foo@bar.baz',
};

const modifiedUserInfo = mockBuilder(defaultUserInfo).id(2).build();
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

const userInfo = mockBuilder(UserInfo) // note that ( ) is used instead of < > here
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

const userInfo = mockBuilder(UserInfo, {id: 1, userName: 'foo'})
                   .userName:('foo bar')
                   .email('foo@bar.baz')
                   .build();

```

### Usage with strictMockBuilder

`strictMockBuilder` is used to make sure all variables are initialized.

```typescript
interface UserInfo {
  id: number;
  userName: string;
  email: string;
}

const userInfo = strictMockBuilder<UserInfo>().id(1).build(); // This expression is not callable.
// Type 'never' has no call signatures.ts(2349)
```

All variables must be initialized before calling `build()`.

```typescript
const userInfo = strictMockBuilder<UserInfo>()
  .id(1)
  .userName('foo')
  .email('foo@bar.baz')
  .build(); // build() is called successfully
```

Notes:
`strictMockBuilder` does not support classes.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

https://github.com/Vincent-Pang/builder-pattern is the original repository that this was forked from.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
