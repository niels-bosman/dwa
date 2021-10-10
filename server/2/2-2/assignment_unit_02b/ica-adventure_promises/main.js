'use strict';

const readline = require('readline');
const game     = require('./game');

const rl = readline.createInterface(process.stdin, process.stdout);

const COMMAND_ERROR = Symbol();

rl.setPrompt('action?> ');
rl.prompt();

rl.on('line', (line) => {
  const [command, argument] = line.trim().split(' ');
  execute(command, argument).then(result => {
    console.log(result);
    return rl.prompt();
  }).catch((error) => {
    if (error.code === COMMAND_ERROR) {
      console.log(`Error: ${error.message}`);
      return rl.prompt();
    }

    console.error('Throwing error');
    throw error;
  });

}).on('close', () => {
  console.log('Leaving the game');
  process.exit(0);
});

function execute(command, argument) {
  let response;
  switch (command) {
    case 'where':
    case 'w':
      return new Promise(resolve => {
        game.getLocationInformation().then(locationInformation => {
          response = `you are in ${locationInformation.description}`;
          response += '\nand you can go to these location(s): ';
          response += locationInformation.exits.reduce((allExits, exit) => {
            return `allExits + \n - ${exit}`;
          }, '');

          resolve(response);
        });
      });
    case 'goto':
    case 'g':
      return new Promise((resolve, reject) => {
        console.log(argument);
        if (argument !== null && argument !== undefined) {
          game.goToLocation(argument)
            .then((locationDescription) => resolve(`You are in ${locationDescription}`));
        } else {
          reject({
            message: `The input '${command}' needs an argument`,
            code:    COMMAND_ERROR,
          });
        }
      });
    default:
      return Promise.reject({
        message: `The input: '${command}' is not defined`,
        code:    COMMAND_ERROR,
      });
  }
}