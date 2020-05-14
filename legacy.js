const _debug = require('debug');
const get = require('lodash/get');

const debug = _debug('bottender:proposal:multi-turns');

const dialogs = {};

function beginDialog(name) {
  const step0 = dialogs[name][0];

  return async (context, props) => {
    const probablyPrompt = await step0(context, props);

    if (probablyPrompt && probablyPrompt.isPrompt) {
      const lock = {
        dialog: name,
        step: 0,
        props: {
          ...props,
          ...probablyPrompt.props,
        },
        prompt: {
          property: probablyPrompt.property,
        },
      };

      context.setState({
        bottender: {
          lock,
        },
      });
    } else {
      context.setState({
        bottender: {
          lock: null,
        },
      });
    }

    return probablyPrompt;
  };
}

function addDialog(name, steps) {
  dialogs[name] = steps;

  return beginDialog(name);
}

function continueDialog(Fn) {
  let dialogName;

  const nextStep = async context => {
    // TODO: we should handle more use case here
    if (!context.event.isText) {
      context.setState({
        bottender: {
          lock: null,
        },
      });

      return Fn;
    }

    const stateLock = get(context.state, 'bottender.lock');

    const { dialog, step, props } = stateLock;
    const { property } = stateLock.prompt;

    const nextStepIndex = step + 1;
    const stepN = dialogs[dialog][nextStepIndex];

    dialogName = stepN.name;

    const probablyPrompt = await stepN(context, {
      ...props,
      prompt: {
        [property]: context.event.text,
      },
    });

    if (probablyPrompt && probablyPrompt.isPrompt) {
      const lock = {
        dialog,
        step: nextStepIndex,
        props: {
          ...props,
          ...probablyPrompt.props,
        },
        prompt: {
          property: probablyPrompt.property,
        },
      };

      context.setState({
        bottender: {
          lock,
        },
      });
    } else {
      context.setState({
        bottender: {
          lock: null,
        },
      });
    }

    return probablyPrompt;
  };

  if (dialogName) {
    nextStep.name = dialogName;
  }

  return nextStep;
}

function prompt(property, { props } = {}) {
  return {
    isPrompt: true,
    property,
    props,
  };
}

function run(Fn) {
  return async context => {
    const lock = get(context.state, 'bottender.lock');

    let nextDialog;

    if (lock) {
      nextDialog = continueDialog(Fn);
    } else {
      nextDialog = Fn;
    }

    do {
      debug(`Current Dialog: ${nextDialog.name || 'Anonymous'}`);
      // eslint-disable-next-line no-await-in-loop
      nextDialog = await nextDialog(context, {});
    } while (typeof nextDialog === 'function');
  };
}

module.exports = {
  addDialog,
  beginDialog,
  continueDialog,
  prompt,
  run,
};
