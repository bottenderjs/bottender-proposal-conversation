const { registerAction, getAction, run, prompt } = require('../..');

registerAction(
  'AskLikeCheeseOrNotByTextQuickReplies',
  async function AskLikeCheeseOrNotByTextQuickReplies(context, props) {
    if (!props.result) {
      await context.sendText('Do you like cheese?', {
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'Yes',
                text: 'yes',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'No',
                text: 'no',
              },
            },
          ],
        },
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
  return getAction('AskLikeCheeseOrNotByTextQuickReplies');
});
