const { router, text } = require('bottender/router');

const { registerAction, getAction, run, prompt } = require('../..');

registerAction('AskLikeCheeseOrNot', async function AskLikeCheeseOrNot(
  context,
  props
) {
  if (!props.result) {
    await context.sendConfirmTemplate('Do you like cheese?', {
      text: 'Do you like cheese?',
      actions: [
        {
          type: 'message',
          label: 'Yes',
          text: 'yes',
        },
        {
          type: 'message',
          label: 'No',
          text: 'no',
        },
      ],
    });
    return prompt('result');
  }

  if (props.result === 'yes') {
    await context.sendText('You said yes! How wonderful.');
  } else if (props.result === 'no') {
    await context.sendText('You said no, that is too bad.');
  } else {
    await context.sendText('Sorry I did not understand.');
    return getAction('App');
  }
});

async function Hi(context) {
  await context.sendText('hi');
}

module.exports = run(function App() {
  return router([text('hi', Hi), text('*', getAction('AskLikeCheeseOrNot'))]);
});
