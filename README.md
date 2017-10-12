# builder-pattern

Create a builder pattern for Typescript using ES6 proxy.

## Installation

```
yarn add builder-pattern
```

## Usage

You have an UserInfo interface
```
interface UserInfo
{
    id: number;
    userName: string;
    email: string;
}
```

Without builder-pattern, you may initialize the object like this.
```
const userInfo: UserInfo = {} as any;

userInfo.id = 1;
userInfo.userName = 'Vincent';
userInfo.email = 'abc@abc.com';
```

And you want an immutable object later, so you do this.
```
const userInfo: Readonly<UserInfo> = {} as any;

userInfo.id = 1;  // TS2540:Cannot assign to 'id' because it is a constant or a read-only property.

```

With builder-pattern, you can initialize the object like this.
```
const userInfo: Readonly<UserInfo> = Builder<UserInfo>()
                                        .id(1)
                                        .userName('Vincent')
                                        .email('abc@abc.com')
                                        .build();

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
