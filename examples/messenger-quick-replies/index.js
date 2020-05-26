const {
  registerAction,
  run,
  prompt,
} = require('@bottender/proposal-conversation');

const AskLikeCheeseOrNotByTextQuickReplies = registerAction(
  'AskLikeCheeseOrNotByTextQuickReplies',
  async function AskLikeCheeseOrNotByTextQuickReplies(context, props) {
    if (!props.result) {
      await context.sendText('Do you like cheese?', {
        quickReplies: [
          {
            contentType: 'text',
            title: 'yes',
            payload: 'yes',
          },
          {
            type: 'message',
            title: 'no',
            payload: 'no',
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
    }
  }
);

module.exports = run(function App() {
  return AskLikeCheeseOrNotByTextQuickReplies;
});
