import { CommandHandler } from '../../../types/command-handler';
import { RollcallRenderer } from './common/rollcall-renderer';

export const excuseMeButton: CommandHandler = async (command) => {
  const rollcallRenderer = new RollcallRenderer();

  return rollcallRenderer.excuseMe(command);
};
