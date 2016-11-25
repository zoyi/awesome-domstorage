# awesome-domstorage
version 1.1.5

awesome-domstorage provides an abstraction for two web storages built in modern web browsers:
LocalStorage and SessionStorage

LocalStorageService (SessionStorageService) provides an abstraction for Web storage (Dom storage) of a web browser.
The difference between the two storage services is the web storage (built-in) handled.


## Multi-Layer Structuring of Key-Value Pairs
Knowing that Web Storage is of only a single layer structure, this service
helps nested structuring of key-value pairs by filling dashes in-between.

e.g. You might want to have a structure like the following,
```
   {'key1': {
      'foo': 'false',
      'bar': 'true'
    },
    'messenger': {
      ...
    }
    ...
   }
```

In this case, 'foo' of 'key1' becomes 'key1-foo' with value 'false'.

## Casting
Note that Web Storage can only have STRING value NOT BOOLEAN. However,
'false' (string) becomes false (boolean) by calling stringToBoolean().
'null'(string) becomes null (null) as well.

## Protected Namespace
setPrefix() to set prefix for each key in order to avoid potential conflicts.
e.g. Using the aforementioned example, 'key1-foo' is prefixed with 'myApp'
    'myApp-key1-foo' = false
    ...
    
## Emergency Storage of Its Own
In case where the Web Storage cannot be used, this service generates
its own temporary storage object to store the configuration. Temporary storage
expires every time the web page is refreshed, though.

# Install
https://www.npmjs.com/package/awesome-domstorage
```
npm install awesome-domstorage
```

# Usage
```
import { LocalStorage, SessionStorage} from 'awesome-domstorage'

const NAME = 'your-app'
LocalStorage.init({foo: 'bar'}, NAME)
LocalStorage.set(['container', 'star'], 'shining')

var starIs = LocalStorage.get(['container', 'star'])
```
