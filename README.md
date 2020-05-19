# bottender-proposal-conversation

> A candidate of the Bottender conversation module

## Installation

```sh
npm install @bottender/proposal-conversation
```

Or 

```sh
yarn add @bottender/proposal-conversation
```

## Usage

First of all, you have to wrap your root `App` entry in the `run` function exported by this package:

```js
const { run } = require('@bottender/proposal-conversation');

module.exports = run(function App() {
  // ...
});
```

Because we implemented this proposal outside of the `bottender` package, calling the `run` function is necessary here to extend the default behavior of the Bottender framework.

After that you may use the `registerAction` function to register actions which can return a `prompt` call as the return value. By doing so, when the user answers the question, this action is executed again and the input text becomes the props of the action:

```js
const { run, registerAction, getAction, prompt } = require('@bottender/proposal-conversation');

registerAction('AskLikeCheeseOrNot', async function AskLikeCheeseOrNot(
  context,
  props
) {
  if (!props.result) {
    await context.sendText('Do you like cheese? (yes/no)');
    return prompt('result');
  }

  if (props.result === 'yes') {
    await context.sendText('You said yes! How wonderful.');
  } else if (props.result === 'no') {
    await context.sendText('You said no, that is too bad.');
  } else {
    await context.sendText('Sorry I did not understand.');
  }
});

module.exports = run(function App() {
  return getAction('AskLikeCheeseOrNot');
});
```

## Examples

We have a bunch of examples in the [examples](https://github.com/Yoctol/bottender-proposal-conversation/tree/master/examples) folder.

## API

### registerAction(name: string, action: Action)

Register the action.

```js
const { registerAction } = require('@bottender/proposal-conversation');

registerAction('AskLikeCheeseOrNot', async function AskLikeCheeseOrNot(
  context,
  props
) {
  // ...
});
```

> **Note:** You must call `registerAction` before calling the `getAction` function, so we recommend putting them on the top of the `index.js` or `src/index.js` file.

### getAction(name: string)

Get the registered action by the name.

```js
const { getAction } = require('@bottender/proposal-conversation');

const action = getAction('AskLikeCheeseOrNot');
```

### prompt(key: string)

```js
const { prompt } = require('@bottender/proposal-conversation');

registerAction('AskName', async function AskName(context, props) {
  if (!props.name) {
    await context.sendText('Please type your name:');
    return prompt('name');
  }

  await context.sendText(`Hi, ${props.name}`);
});
```

> **Note:** `prompt` can only be used inside the registered action.

### setField(context: Context, field: string, value: any)

Set the value of the field.

```js
const { setField } = require('@bottender/proposal-conversation');

registerAction('AskName', async function AskName(context, props) {
  if (!props.name) {
    await context.sendText('Please type your name:');
    return prompt('name');
  }

  let name = props.name;
  if (props.name.length > 30) {
    name = `${props.name.slice(0, 27)}...`;
    setField(context, 'name', name);
    await context.sendText(
      `Name can't be more than 30 characters. Set your name to ${name}`
    );
  }

  // ...
});
```

> **Note:** `setField` can only be used inside the registered action.

### deleteField(context: Context, field: string | string[])

Delete the value of the field.

```js
const { deleteField } = require('@bottender/proposal-conversation');

registerAction('AskNameAndPhone', async function AskNameAndPhone(context, props) {
  if (!props.name) {
    await context.sendText('Please type your name:');
    return prompt('name');
  }

  if (!props.phone) {
    await context.sendText('Please type your phone number:');
    return prompt('phone');
  }

  if (!props.confirm) {
    await context.sendText(
      `${props.name}, your phone number is ${props.phone}, right? If not, which part you want to refill? (yes|name|phone)`
    );
    return prompt('confirm');
  }

  if (props.confirm === 'yes') {
    await context.sendText(
      `Thank you for your help, your personal data was stored correctly.`
    );
  } else if (props.confirm === 'name') {
    deleteField(context, ['name', 'confirm']);
    await context.sendText('Please retype your name:');
    return prompt('name');
  } else if (props.confirm === 'phone') {
    deleteField(context, ['phone', 'confirm']);
    await context.sendText('Please retype your phone again:');
    return prompt('phone');
  } 
});
```

> **Note:** `deleteField` can only be used inside the registered action.

### run(action: Action)

The extension of the runner in the Bottender framework.

```js
module.exports = run(function App() {
  // ...
});
```
