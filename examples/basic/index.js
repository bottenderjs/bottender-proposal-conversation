const { router, text } = require('bottender/router');

const { registerAction, getAction, run, prompt } = require('../..');

// Register the action before handling events
registerAction('AskLikeCheeseOrNot', async function AskLikeCheeseOrNot(
  context,
  props
) {
  if (!props.result) {
    await context.sendText('Do you like cheese?');
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

async function Hi(context) {
  await context.sendText('hi');
}

module.exports = run(function App() {
  return router([
    text('hi', Hi),
    // Use the getAction function to get the registered action
    text('*', getAction('AskLikeCheeseOrNot')),
  ]);
});
