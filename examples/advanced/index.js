const { registerAction, getAction, run, promptField, setField, deleteField } = require('../..');

registerAction('AskNameAndPhone', async function AskNameAndPhone(context, props) {
  if (!props.name) {
    await context.sendText('Please type your name:');
		return promptField('name');
  }
  
  if (props.name && props.name.length > 30) {
    const name = props.name.slice(0, 27) + '...';
    setField(context, 'name', name);
    await context.sendText(`Name can\'t be over 30 chars. Set your name to ${name}`);
  }
	
	if (!props.phone) {
    await context.sendText('Please type your phone number (10 digits):');
    return promptField('phone');
  } 

  if (props.phone && props.phone.length != 10) {
    await context.sendText(`Your input ${props.phone} is invalid. Please retype your phone again:`);
    return promptField('phone');
  }

  if (!props.confirm) {
    await context.sendText(`${props.name}, your phone number is ${props.phone}, right? If not, which part you want to refill? (yes|name|phone|both)`);
    return promptField('confirm');
  }

  if (props.confirm == 'yes') {
    await context.sendText(`Thank you for your help, your personal data was stored correctly.`);
  } else if (props.confirm === 'name') {
    deleteField(context, ['name', 'confirm']);
    await context.sendText('Please retype your name:');
		return promptField('name');
	} else if (props.confirm === 'phone') {
    deleteField(context, ['phone', 'confirm']);
    await context.sendText('Please retype your phone:');
		return promptField('phone');
	} else if (props.confirm === 'both') {
    deleteField(context, ['confirm', 'name', 'phone']);
		return getAction('AskNameAndPhone');
	}
});

module.exports = run(function App() {
  return getAction('AskNameAndPhone');
});