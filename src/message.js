import { color, colorLog, setColor } from './utils/colors.js';

const Message = {
  WELCOME: 'Welcome to the File Manager, %%USER%%!',
  BYE: 'Thank you for using File Manager, %%USER%%, goodbye!',
  CURRENT_PATH: 'You are currently in %%CURRENT_PATH%%',
  OPERATION_FAILED: 'Operation failed',
  INVALID_INPUT: 'Invalid input',
  ANONIMOUS_USER: 'Anonimous',

  sayHi(userName) {
    colorLog(color.green, Message.WELCOME.replace('%%USER%%', userName));
  },

  printCurrentPath(currentPath) {
    console.log(Message.CURRENT_PATH.replace('%%CURRENT_PATH%%', setColor(currentPath, color.cyan)));
  },

  sayGoodbye(userName) {
    colorLog(color.green, Message.BYE.replace('%%USER%%', userName));
  }
}

export default Message;





