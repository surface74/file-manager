import { color, colorLog, setColor } from './utils/colors.js';

const Message = {
  ANONIMOUS_USER: 'Anonimous',
  BYE: 'Thank you for using File Manager, %%USER%%, goodbye!',
  CURRENT_PATH: 'You are currently in %%CURRENT_PATH%%',
  FILE_EXISTS: 'file %%FILE%% already exists',
  INVALID_INPUT: 'Invalid input',
  INVALID_COMMAND: 'Invalid command',
  INVALID_OPTION: 'Invalid option %%OPTION%%',
  NEED_2_ARGS: 'must be passed 2 parameters',
  OPERATION_FAILED: 'Operation failed',
  ONLY_DASHED_OPTION_ALLOWED: 'the option has to start with "--"',
  SECOND_ARG_FILE_NAME: '2nd parameter has to be the file name only',
  WELCOME: 'Welcome to the File Manager, %%USER%%!',
  WRONG_DOUBLE_QUOTERS: 'Wrong double quoters count/order',

  sayHi(userName) {
    colorLog(color.green, Message.WELCOME.replace('%%USER%%', userName));
  },

  printCurrentPath() {
    console.log(Message.CURRENT_PATH.replace('%%CURRENT_PATH%%', setColor(process.cwd(), color.cyan)));
  },

  sayGoodbye(userName) {
    colorLog(color.green, Message.BYE.replace('%%USER%%', userName));
  }
}

export default Message;





