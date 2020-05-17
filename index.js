const _debug = require('debug');
const get = require('lodash/get');

const debugAction = _debug('bottender:proposal:conversation');

const actions = {};

/**
 * Register and get action
 */
function registerAction(name, action) {
  actions[name] = action;
}

function getAction(name) {
  return function SetCurrentAction(context, props) {
    // FIXME: avoid using state to label current action
    context.setState({ currentAction: name });

    return actions[name](context, props);
  };
}

/**
 * Prompt data structure
 */

function prompt(name) {
  return {
    isPrompt: true,
    name,
  };
}

/**
 * Set teh value of the field
 */
function setField(context, name, value) {
  context.setState({
    bottender: {
      lock: {
        ...context.state.bottender.lock,
        props: {
          ...context.state.bottender.lock.props,
          [name]: value,
        },
      },
    },
  });
}

/**
 * Delete the value of the field
 */
function deleteField(context, nameOrNames) {
  if (Array.isArray(nameOrNames)) {
    const names = nameOrNames;
    names.forEach((name) => {
      setField(context, name, undefined);
    });
    return;
  }
  const name = nameOrNames;
  setField(context, name, undefined);
}

/**
 * Runner extension
 */
function run(action) {
  registerAction('App', action);

  return async (context, props) => {
    // check if lock exists
    const lock = get(context.state, 'bottender.lock');

    let entryAction = action;
    let entryProps = props;

    if (lock) {
      // TODO: we should handle more use case here, for example, line datetime payload
      if (context.event.isText) {
        const lockAction = getAction(lock.actionName);
        if (lockAction) {
          entryAction = lockAction;
          entryProps = {
            ...lock.props,
            [lock.promptName]: context.event.text.trim(),
          };
          setField(context, lock.promptName, context.event.text);
        }
      }
    }

    debugAction(`Current Action: ${entryAction.name || 'Anonymous'}`);
    let next = await entryAction(context, entryProps);

    while (typeof next === 'function') {
      debugAction(`Current Action: ${next.name || 'Anonymous'}`);
      // eslint-disable-next-line no-await-in-loop
      next = await next(context, {});
    }

    if (next && next.isPrompt) {
      const prompt = next;

      const newLock = {
        // FIXME: avoid using state to label current action
        actionName: context.state.currentAction,
        promptName: prompt.name,
        props: lock ? context.state.bottender.lock.props : {},
      };

      context.setState({
        bottender: {
          lock: newLock,
        },
      });

      return;
    }

    if (lock) {
      context.setState({
        bottender: {
          lock: null,
        },
      });
    }

    return next;
  };
}

module.exports = {
  registerAction,
  getAction,

  prompt,
  setField,
  deleteField,

  run,
};
