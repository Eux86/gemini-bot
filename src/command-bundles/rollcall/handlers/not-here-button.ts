import { CommandHandler } from '../../../types/command-handler';
import { RollcallRenderer } from './common/rollcall-renderer';

export const notHereButtonHandler: CommandHandler = async (command) => {
  const rollcallRenderer = new RollcallRenderer();
  return rollcallRenderer.removeParticipant(command, undefined);
};
