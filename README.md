# builder-pattern

Create a builder pattern for Typescript using ES6 proxy.

## Installation

```
yarn add builder-pattern
```

## Usage

### Basic usage
```
interface UserInfo {
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
A note of caution: when building objects from scratch, the builder currently cannot ensure that all
mandatory fields have been set. The built object might thus violate the contract of the given interface. 
For example, the following will compile (see also the example in the tests):

```
const brokenUserInfo = Builder<UserInfo>()
                         .build();
```
A way around this is to use template objects, see next section.

### Usage with template objects

You can also specify a template object, which allows easy creation of variation of objects. 
This is especially useful for making test data setup more readable:

```
const defaultUserInfo: UserInfo = {
  id: 1,
  userName: 'foo',
  email: 'foo@bar.baz'
};

const modifiedUserInfo = Builder(defaultUserInfo)
                          .id(2)
                          .build();
```
Note that with this approach, if the template object conforms to the interface, the
built object will, too.

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
