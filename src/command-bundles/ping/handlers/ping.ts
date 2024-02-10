import { CommandHandler } from '../../../types/command-handler';
import { InteractionStyle } from '../../../command-service/command-service.interface';

export const pingHandler: CommandHandler = async (command) => {
  const interactions = [
    {
      id: 'pang',
      label: 'pang',
      style: InteractionStyle.Primary,
    },
    {
      id: 'action2',
      label: 'action2',
      style: InteractionStyle.Secondary,
    },
  ];
  command.reply({ content: 'pong', interactions });
};
