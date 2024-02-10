import { CommandHandler } from '../../../types/command-handler';
import { RollcallRenderer } from './common/rollcall-renderer';

export const pullDownButtonHandler: CommandHandler = async (command) => {
  const rollcallRenderer = new RollcallRenderer();

  return rollcallRenderer.rollcall(command);
};
