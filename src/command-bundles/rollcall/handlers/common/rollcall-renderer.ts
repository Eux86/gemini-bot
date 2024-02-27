import { RollcallService } from '../../services/rollcall-service';
import {
  RollcallAlreadyExistException,
  RollcallUserAlreadyNotRegisteredException,
  RollcallUserAlreadyRegisteredException,
} from '../../services/errors';
import { Command } from '../../../../types/command-handler';
import {
  excuses,
  rollcallInteractions,
  rollcallTemplate,
} from './rollcall-template';

export class RollcallRenderer {
  public rollcall = async (command: Command) => {
    const rollcallService = await RollcallService.getInstance();

    const message = await command.reply({
      content: rollcallTemplate({ participants: [], notParticipants: [] }),
      interactions: rollcallInteractions,
    });
    try {
      let rollcallMessage = await rollcallService.getToday(
        message.channel?.id || 'nochannel',
      );
      if (!rollcallMessage) {
        rollcallMessage = await rollcallService.startToday(
          message.channel?.id || 'nochannel',
        );
      }
      if (rollcallMessage.messageId) {
        console.log('Old message found, deleting it.');
        await this.deleteOldMessage(command, rollcallMessage.messageId);
        console.log('Old message deleted');
      }
      await rollcallService.bindToMessage(rollcallMessage, message.id);
      const content = rollcallTemplate({
        participants: rollcallMessage.participants || [],
        notParticipants: rollcallMessage.notParticipants || [],
      });
      await message.edit(content);
    } catch (e) {
      if (e instanceof RollcallAlreadyExistException) {
        console.info('Rollcall already exists');
      } else {
        throw e;
      }
    }
  };

  public addParticipant = async (command: Command) => {
    const rollcallService = await RollcallService.getInstance();
    const todayRollcall = await rollcallService.getToday(command.channel.id);
    if (!todayRollcall) {
      await command.reply({ content: 'There is no rollcall for today' });
    } else {
      if (!todayRollcall.messageId) {
        await command.reply({ content: 'Could not find the rollcall message' });
      } else {
        try {
          await rollcallService.addParticipant(todayRollcall, command.username);
          await this.update(
            command,
            todayRollcall.messageId,
            todayRollcall.participants,
            todayRollcall.notParticipants,
          );
          const response = await command.reply({
            content: 'done',
          });
          await response.delete();
        } catch (e) {
          if (e instanceof RollcallUserAlreadyRegisteredException) {
            const response = await command.reply({
              content: 'You are already registered',
            });
            await response.delete();
          }
          throw e;
        }
      }
    }
  };

  public removeParticipant = async (
    command: Command,
    excuse: string | undefined,
  ) => {
    const rollcallService = await RollcallService.getInstance();
    const todayRollcall = await rollcallService.getToday(command.channel.id);
    if (!todayRollcall) {
      await command.reply({ content: 'There is no rollcall for today' });
    } else {
      if (!todayRollcall.messageId) {
        await command.reply({ content: 'Could not find the rollcall message' });
      } else {
        try {
          await rollcallService.removeParticipant(
            todayRollcall,
            command.username,
          );
          await this.update(
            command,
            todayRollcall.messageId,
            todayRollcall.participants,
            todayRollcall.notParticipants,
          );
          if (excuse) {
            await command.reply({ content: excuse });
          } else {
            const response = await command.reply({
              content: 'done',
            });
            await response.delete();
          }
        } catch (e) {
          if (e instanceof RollcallUserAlreadyNotRegisteredException) {
            const response = await command.reply({
              content: 'You already said that you are not participating',
            });
            await response.delete();
          }
          throw e;
        }
      }
    }
  };

  public excuseMe = async (command: Command) => {
    const randomIndex = Math.floor(Math.random() * excuses.length);
    const randomExcuse = excuses[randomIndex];

    const rollcallService = await RollcallService.getInstance();
    const todayRollcall = await rollcallService.getToday(command.channel.id);
    if (!todayRollcall) {
      await command.reply({ content: 'There is no rollcall for today' });
    } else {
      if (!todayRollcall.messageId) {
        await command.reply({ content: 'Could not find the rollcall message' });
      } else {
        try {
          await rollcallService.removeParticipant(
            todayRollcall,
            command.username,
          );
          await this.update(
            command,
            todayRollcall.messageId,
            todayRollcall.participants,
            todayRollcall.notParticipants,
          );
        } catch (e) {
          if (!(e instanceof RollcallUserAlreadyNotRegisteredException)) {
            throw e;
          }
        }
        await command.reply({
          content: `${command.username} ha mandato questo messaggio per spiegare perché oggi non puó partecipare: \n"_${randomExcuse}_"`,
        });
      }
    }
  };

  private update = async (
    command: Command,
    messageId: string,
    participants: string[],
    notParticipants: string[],
  ) => {
    const oldMessage = await command.channel.getMessage(messageId);
    if (oldMessage) {
      const content = rollcallTemplate({
        participants: participants || [],
        notParticipants: notParticipants || [],
      });
      await oldMessage.edit(content);
    }
  };

  private deleteOldMessage = async (command: Command, messageId: string) => {
    try {
      const oldMessage = await command.channel.getMessage(messageId);
      await oldMessage.delete();
    } catch (error) {
      console.error('Message not found', error);
      await command.reply({
        content: 'Could not find original message',
      });
    }
  };
}
