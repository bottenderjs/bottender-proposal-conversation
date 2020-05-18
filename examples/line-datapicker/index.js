const { router, text } = require('bottender/router');

const { registerAction, getAction, run, prompt } = require('../..');

registerAction(
  'AskLikeCheeseOrNotByTextActions',
  async function AskLikeCheeseOrNotByTextActions(context, props) {
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
    }
  }
);

registerAction('AskLikeCheeseOrNotByTextActions', {
  getProps: ({ key, context, prevProps }) => {
    if (key === 'result') {
      if (context.event.isPayload) {
        const { payload } = context.event;
        return {
          ...prevProps,
          result: payload === 'YES' ? 'yes' : 'no',
        };
      }
    }
    return {
      ...prevProps,
      [key]: context.event.text,
    };
  },
  action: async function AskLikeCheeseOrNotByPayloadActions(context, props) {
    if (!props.result) {
      await context.sendConfirmTemplate('Do you like cheese?', {
        text: 'Do you like cheese?',
        actions: [
          {
            type: 'postback',
            label: 'Yes',
            data: 'YES',
            displayText: 'yes',
          },
          {
            type: 'postback',
            label: 'No',
            data: 'NO',
            displayText: 'no',
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
  },
});

async function Hi(context) {
  await context.sendText('hi');
}

module.exports = run(function App() {
  return router([
    text('hi', Hi),
    text('payload', getAction('AskLikeCheeseOrNotByPayloadActions')),
    text('*', getAction('AskLikeCheeseOrNotByTextActions')),
  ]);
});
