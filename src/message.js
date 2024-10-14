import { color, colorLog, setColor } from './utils/colors.js';

const Message = {
  ANONIMOUS_USER: 'Anonimous',
  BYE: 'Thank you for using File Manager, %%USER%%, goodbye!',
  CURRENT_PATH: 'You are currently in %%CURRENT_PATH%%',
  DASHED_OPTION_REQUIRED: 'an option started with "--" required',
  FILE_EXISTS: 'file %%FILE%% already exists',
  FILE_NAME_REQUIRED: 'file name required',
  INVALID_INPUT: 'Invalid input',
  INVALID_COMMAND: 'invalid command',
  INVALID_OPTION: 'invalid option %%OPTION%%',
  NEED_2_ARGS: '2 parameters required',
  OPERATION_FAILED: 'Operation failed',
  SECOND_ARG_FILE_NAME: '2nd parameter has to be the file name only',
  WELCOME: 'Welcome to the File Manager, %%USER%%!',
  WRONG_DOUBLE_QUOTERS: 'wrong double quoters count/order',

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





