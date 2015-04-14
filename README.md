# Trackthis
A module that simplifies working with the TrackThis endpoints.

## Installation
Simply run `npm install --save trackthis`

## Technical
All methods in this library support both callback style and promises. It's entirely up to you which you use.
This library uses the [bluebird promises](https://github.com/petkaantonov/bluebird) library.

## Usage
```javascript
var TrackThis = require('trackthis'),
    trackthis = new TrackThis({
      endpoint: 'http://trackthis.nl/api/action',
      auth    : {
        username: 'foo',
        password: 'bar'
      }
    });
```

### API
Find a complementary documentation page in [the trackthis API docs](http://trackthis.nl/docs/api).

#### .searchAccounts(filters[, done])
Search for accounts based on filters. 

**Example**

```javascript
var TrackThis = require('trackthis'),
    trackthis = new TrackThis({
      endpoint: 'http://trackthis.nl/api/action',
      auth    : {
        username: 'foo',
        password: 'bar'
      }
    });
    
trackthis.api.searchAccounts({username : 'username'})
  .then(function (accounts) {
    // Yeah!
  }).catch(function (error) {
    // Oh noes!
  });
```
