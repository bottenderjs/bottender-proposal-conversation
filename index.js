const _debug = require('debug');
const get = require('lodash/get');
const invariant = require('invariant');

const debugAction = _debug('bottender:proposal:conversation');

// an object map to store actions and their getProps
const actions = Object.create(null);

// default behavior is to attach new key to the props when receiving text events
function defaultGetProps({ key, context, prevProps }) {
  return {
    ...prevProps,
    [key]: context.event.text,
  };
}

/**
 * register the action
 */
function registerAction(name, action) {
  if (typeof action === 'function') {
    actions[name] = {
      action,
      getProps: defaultGetProps,
    };
  } else {
    actions[name] = action;
  }
}

function getAction(name) {
  invariant(
    actions[name] && typeof actions[name].action === 'function',
    `The ${name} action is not registered.`
  );

  return function SetCurrentAction(context, props) {
    // FIXME: avoid using state to label current action
    context.setState({ currentAction: name });

    return actions[name].action(context, props);
  };
}

/**
 * data structure of prompt
 */

function prompt(name) {
  return {
    isPrompt: true,
    name,
  };
}

function setProps(context, props) {
  context.setState({
    bottender: {
      lock: {
        ...context.state.bottender.lock,
        props,
      },
    },
  });
}

/**
 * set the value of the field
 */
function setField(context, name, value) {
  setProps(context, {
    ...context.state.bottender.lock.props,
    [name]: value,
  });
}

/**
 * delete the value of the field
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
 * runner extension of Bottender
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
          const { getProps } = actions[lock.actionName];
          entryAction = lockAction;
          entryProps = getProps({
            key: lock.promptName,
            context,
            prevProps: lock.props,
          });
          setProps(context, entryProps);
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
      const returnPrompt = next;

      const newLock = {
        // FIXME: avoid using state to label current action
        actionName: context.state.currentAction,
        promptName: returnPrompt.name,
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
