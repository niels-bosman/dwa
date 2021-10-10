'use strict';

const readline = require('readline');
const game     = require('./game');

const rl = readline.createInterface(process.stdin, process.stdout);

const COMMAND_ERROR = Symbol();

rl.setPrompt('action?> ');
rl.prompt();

rl.on('line', async line => {
  try {
    const [command, argument] = line.trim().split(' ');
    const result              = await execute(command, argument);
    console.log(result);
    return rl.prompt();
  } catch (error) {
    if (error.code === COMMAND_ERROR) {
      console.log(`Error: ${error.message}`);
      return rl.prompt();
    }

    console.error('Throwing error');
    throw error;
  }

}).on('close', () => {
  console.log('Leaving the game');
  process.exit(0);
});

async function execute(command, argument) {
  let response;
  switch (command) {
    case 'where':
    case 'w':
      const location = await game.getLocationInformation();

      response = `you are in ${location.description}`;
      response += '\nand you can go to these location(s): ';
      response += location.exits.reduce((allExits, exit) => {
        return `allExits + \n - ${exit}`;
      }, '');

      return response;
    case 'goto':
    case 'g':
      console.log(argument);
      if (argument !== null && argument !== undefined) {
        const location = await game.goToLocation(argument);
        return `You are in ${location}`;
      }

      throw new Error({
        message: `The input '${command}' needs an argument`,
        code:    COMMAND_ERROR,
      });
    default:
      throw new Error({
        message: `The input: '${command}' is not defined`,
        code:    COMMAND_ERROR,
      });
  }
}