# Trackthis
A module that simplifies working with the TrackThis endpoints.

## Installation
Simply run `npm install --save trackthis` and start implementing.

## Usage
Usage is very simple. You can find the available methods below.

```javascript
var TrackThis = require('trackthis'),
    trackthis = new TrackThis({
      tracker : {
        websiteKey   : null,
        productGroup : 'webcamsv4',
        websiteDomain: null,
        product      : 'vpscash4'
      },
      api     : {
        endpoint   : 'http://trackthat.nl',
        credentials: {
          username: '',
          password: ''
        }
      }
    });

// Start making API calls.
```

## API
You can find a complementary documentation page in [the trackthis API docs](http://trackthis.nl/docs/api).
This library is loosely based on the API.

**Note:**
All methods in this library support both callback style and promises. It's entirely up to you which you use.
This library uses the [bluebird promises](https://github.com/petkaantonov/bluebird) library.


### .searchAccounts(filters[, done])
Search for accounts based on filters.
You can find the properties available to filter on [here, under *AccountV2 (search)*](http://trackthis.nl/docs/api).

#### Example

```javascript
trackthis.api.searchAccounts({username : 'kaatje'})
  .then(function (accounts) {
    // Yeah!
  }).catch(function (error) {
    // Exception.
  });
```

#### Parameters

| Parameter | Type     | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| filters   | Object   | The name of the recipient                              |
| [done]    | Function | Optional callback, if you don't want to use promises.  |


### .findFull(partnerCode[, done])
Retrieve all known information for an account based on partner code.

#### Example

```javascript
trackthis.api.findFull(123)
  .then(function (account) {
    // Yeah!
  }).catch(function (error) {
    // Exception.
  });
```

#### Parameters

| Parameter   | Type     | Description                                            |
| ----------- | -------- | ------------------------------------------------------ |
| partnerCode | Number   | The partnerCode to get the information for.            |
| [done]      | Function | Optional callback, if you don't want to use promises.  |


### .findAccount(username[, done])
Find information for an account username.

#### Example

```javascript
trackthis.api.findAccount('kaatje')
  .then(function (account) {
    // Yeah!
  }).catch(function (error) {
    // Exception.
  });
```

#### Parameters

| Parameter | Type          | Description                                            |
| --------- | ------------- | ------------------------------------------------------ |
| username  | Object/String | An object of filters, or the username as string.       |
| [done]    | Function      | Optional callback, if you don't want to use promises.  |

**Note:** The available filters are the same as those supplied by `.searchAccounts()`.


### .findPerformer(username[, done])
Find information based on a performer username.

**Note**: This convenience method uses `.findAccount()`, but adds `{type:'webcam'}`.

#### Example

```javascript
trackthis.api.findPerformer('kaatje')
  .then(function (performer) {
    // Yeah!
  }).catch(function (error) {
    // Exception.
  });
```

#### Parameters

| Parameter | Type          | Description                                            |
| --------- | ------------- | ------------------------------------------------------ |
| username  | Object/String | An object of filters, or the username as string.       |
| [done]    | Function      | Optional callback, if you don't want to use promises.  |

**Note:** The available filters are the same as those supplied by `.searchAccounts()`.


### .findStudio(username[, done])
Find information based on a studio username.

**Note**: This convenience method uses `.findAccount()`, but adds `{type:'studio'}`.

#### Example

```javascript
trackthis.api.findStudio('studioName')
  .then(function (studio) {
    // Yeah!
  }).catch(function (error) {
    // Exception.
  });
```

#### Parameters

| Parameter | Type          | Description                                            |
| --------- | ------------- | ------------------------------------------------------ |
| username  | Object/String | An object of filters, or the username as string.       |
| [done]    | Function      | Optional callback, if you don't want to use promises.  |

**Note:** The available filters are the same as those supplied by `.searchAccounts()`.


### .createAccount(accountOptions[, done])
Register a new account with TrackThis. Parameter `accountOptions` accepts a `type` and a `username`. 

#### Example

```javascript
trackthis.api.createAccount({type: 'webcam', username: 'lookatme'})
  .then(function (response) {
    // Yeah!
  }).catch(function (error) {
    // Exception.
  });
```

#### Parameters

| Parameter      | Type     | Description                                            |
| -------------- | -------- | ------------------------------------------------------ |
| accountOptions | Object   | Username and Type for the new account.                 |
| [done]         | Function | Optional callback, if you don't want to use promises.  |


### .editAccount(partnerCode, changes[, done])
Edit the account properties for `partnerCode`. 
You can find the properties available to supply [here, under *AccountV2 (edit)*](http://trackthis.nl/docs/api), parameter `changes`.

#### Example

```javascript
trackthis.api.editAccount(123, {email: 'new@domain.org})
  .then(function (response) {
    // Yeah!
  }).catch(function (error) {
    // Exception.
  });
```

#### Parameters

| Parameter   | Type     | Description                                            |
| ----------- | -------- | ------------------------------------------------------ |
| partnerCode | Number   | The partnerCode to update the account for.             |
| changes     | Object   | The changes to apply.                                  |
| [done]      | Function | Optional callback, if you don't want to use promises.  |


### .registerPerformer(performerOptions[, done])
Create a new performer account.
This convenience method combines `.createAccount()` and `.editAccount()`. 
The `performerOptions` available to supply are those from `.createAccount()` and `.editAccount()` mixed.

#### Example

```javascript
trackthis.api.registerPerformer({
  username    : 'lookatme',
  email       : 'lookatme@now.net',
  password    : 'hard2guessss',
  account_iban: 'foobar123'
}).then(function (response) {
  // Yeah!
}).catch(function (error) {
  // Exception.
});
```

#### Parameters

| Parameter        | Type     | Description                                            |
| ---------------- | -------- | ------------------------------------------------------ |
| performerOptions | Object   | Options for the new performer account.                 |
| [done]           | Function | Optional callback, if you don't want to use promises.  |


### .validateCredentials(credentials[, done])
Validate the credentials for an account.
This method checks if the credentials match with trackthis, and if so returns account information.
Argument `credentials` accepts properties `type`, `username` and `password`.

#### Example

```javascript
trackthis.api.validateCredentials({
  type    : 'studio',
  username: 'studioname',
  password: 'foobar123'
}).then(function (result) {
  if (result.valid) {
    // Something to work with.
    var accountInfo = result.details;
  }
}).catch(function (error) {
  // Exception.
});
```

#### Parameters

| Parameter   | Type     | Description                                            |
| ----------- | -------- | ------------------------------------------------------ |
| credentials | Object   | Credentials to check.                                  |
| [done]      | Function | Optional callback, if you don't want to use promises.  |
