# builder-pattern

Create a builder pattern for Typescript using ES6 proxy.

## Installation

```
yarn add builder-pattern
```

## Usage

```
interface UserInfo
{
    id: number;
    userName: string;
    email: string;
}

const userInfo = Builder<UserInfo>()
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
