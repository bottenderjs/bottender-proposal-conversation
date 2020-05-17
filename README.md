# bottender-proposal-conversation

## Usage

```js
registerAction("AskLikeCheeseOrNot", async function AskLikeCheeseOrNot(
  context,
  props
) {
  if (!props.result) {
    await context.sendText("Do you like cheese?");
    return prompt("result");
  }

  if (props.result === "yes") {
    await context.sendText("You said yes! How wonderful.");
  } else if (props.result === "no") {
    await context.sendText("You said no, that is too bad.");
  } else {
    await context.sendText("Sorry I did not understand.");
  }
});

module.exports = run(function App() {
  return getAction("AskLikeCheeseOrNot");
});
```

## API

### registerAction

### getAction

### prompt

### setField

### deleteField

### run
