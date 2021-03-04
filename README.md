# Logger Plugin for Rematch

## Install
`npm i --save rematch-logger-plugin`

## Usage
```javascript
// Logger with default options
import rematchLogger from 'rematch-logger-plugin';
import { init } from '@rematch/core';

const store = init({
    name: 'xxx',
    plugins: [rematchLogger()],
    models: {
      // ...models
    }
})
```

Also, You can config some custom options
```javascript
import rematchLogger from 'rematch-logger-plugin';
import { init } from '@rematch/core';

const logger = rematchLogger({
  // ...options
});

const store = init({
    name: 'xxx',
    plugins: [logger],
    models: {
      // ...models
    }
})
```

## Options
```javascript
{
  enable = true: Boolean, // enable print feature?
  duration = true: Boolean, // print the duration?
  timestamp = true: Boolean, // print the timestamp?
}
```

Please look forward to more features...