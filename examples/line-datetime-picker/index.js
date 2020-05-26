const { router, text } = require('bottender/router');
const {
  registerAction,
  run,
  prompt,
} = require('@bottender/proposal-conversation');

const AskDate = registerAction('AskDate', {
  getProps: ({ key, context, prevProps }) => {
    if (
      key === 'date' &&
      context.event.isPayload &&
      context.event.payload === 'PREFER_TIME'
    ) {
      return {
        ...prevProps,
        date: context.event.postback.params.date,
      };
    }
    return {
      ...prevProps,
      [key]: context.event.text,
    };
  },
  action: async function AskDate(context, props) {
    if (!props.date) {
      await context.sendText('What time would you prefer?', {
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'datetimepicker',
                label: 'Select date',
                data: 'PREFER_TIME',
                mode: 'date',
              },
            },
          ],
        },
      });
      return prompt('date');
    }

    await context.sendText(`Ok. See you at ${props.date}`);
  },
});

const AskTime = registerAction('AskTime', {
  getProps: ({ key, context, prevProps }) => {
    if (
      key === 'time' &&
      context.event.isPayload &&
      context.event.payload === 'PREFER_TIME'
    ) {
      return {
        ...prevProps,
        time: context.event.postback.params.time,
      };
    }
    return {
      ...prevProps,
      [key]: context.event.text,
    };
  },
  action: async function AskTime(context, props) {
    if (!props.time) {
      await context.sendText('What time would you prefer?', {
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'datetimepicker',
                label: 'Select time',
                data: 'PREFER_TIME',
                mode: 'time',
              },
            },
          ],
        },
      });
      return prompt('time');
    }

    await context.sendText(`Ok. See you at ${props.time}`);
  },
});

const AskDatetime = registerAction('AskDatetime', {
  getProps: ({ key, context, prevProps }) => {
    if (
      key === 'datetime' &&
      context.event.isPayload &&
      context.event.payload === 'PREFER_TIME'
    ) {
      return {
        ...prevProps,
        datetime: context.event.postback.params.datetime,
      };
    }
    return {
      ...prevProps,
      [key]: context.event.text,
    };
  },
  action: async function AskDatetime(context, props) {
    if (!props.datetime) {
      await context.sendText('What time would you prefer?', {
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'datetimepicker',
                label: 'Select time',
                data: 'PREFER_TIME',
                mode: 'datetime',
              },
            },
          ],
        },
      });
      return prompt('datetime');
    }

    await context.sendText(`Ok. See you at ${props.datetime}`);
  },
});

module.exports = run(function App() {
  return router([
    text('date', AskDate),
    text('time', AskTime),
    text('*', AskDatetime),
  ]);
});
