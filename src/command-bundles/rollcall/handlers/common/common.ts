import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildTextBasedChannel,
  MessageCreateOptions,
  TextBasedChannel,
} from 'discord.js';
import { IRollcall } from '../../types/rollcall';
import { IRollcallService } from '../../types/rollcall-service';
import {
  RollcallAlreadyExistException,
  RollcallUserAlreadyNotRegisteredException,
  RollcallUserAlreadyRegisteredException,
} from '../../services/errors';

const generateMessageContent = (rollcall: IRollcall) => `
Rollcall started. Available commands: 
here: join the rollcall
not-here: remove your presence from the rollcall
rollcall-pull: pulls down the rollcall message

${rollcall.participants.length} present${
  rollcall.participants.length > 1 ? 's' : ''
}: ${rollcall.participants.join(', ')}
${rollcall.notParticipants.length} NOT present${
  rollcall.participants.length > 1 ? 's' : ''
}: ${rollcall.notParticipants.join(', ')}
`;

const generateMessageComponents = () => {
  const hereButton = new ButtonBuilder()
    .setCustomId('hereButton')
    .setLabel('👍 Here')
    .setStyle(ButtonStyle.Primary);
  const notHereButton = new ButtonBuilder()
    .setCustomId('notHereButton')
    .setLabel('👎 Not Here')
    .setStyle(ButtonStyle.Primary);
  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(hereButton)
    .addComponents(notHereButton);
  return [row];
};

const createRollcallMessage = (
  todayRollcall: IRollcall,
): MessageCreateOptions => {
  const content = generateMessageContent(todayRollcall);
  const components = generateMessageComponents();

  const message: MessageCreateOptions = {
    content,
    components,
  };
  return message;
};

const sendRollcallMessge = async (
  rollcallService: IRollcallService,
  channel: GuildTextBasedChannel | TextBasedChannel,
  todayRollcall: IRollcall,
) => {
  const message = createRollcallMessage(todayRollcall);
  const rollcallMessage = await channel.send(message);

  await rollcallService.bindToMessage(todayRollcall, rollcallMessage);
};

export const rollcallPull = async (
  rollcallService: IRollcallService,
  channel: GuildTextBasedChannel | TextBasedChannel,
) => {
  try {
    const todayRollcall = await rollcallService.getToday(channel.id);
    if (!todayRollcall) {
      await channel.send('There is no rollcall for today. Create one first!');
      return;
    }
    await sendRollcallMessge(rollcallService, channel, todayRollcall);
  } catch (e) {
    switch ((e as Error).message || e) {
      case 'ROLLCALL_ALREADY_EXISTS':
        await channel.send(
          'Cannot start rollcall. A rollcall already exists for today: \n',
        );
        break;
      default:
        await channel.send(`Something went wrong :/\n${e}`);
    }
  }
};

export const common = async (
  rollcallService: IRollcallService,
  channel: GuildTextBasedChannel | TextBasedChannel,
): Promise<IRollcall> => {
  const todayRollcall = await rollcallService.startToday(channel.id);
  await sendRollcallMessge(rollcallService, channel, todayRollcall);
  return todayRollcall;
};

export const createRollCallOrPull = async (
  rollcallService: IRollcallService,
  channel: GuildTextBasedChannel | TextBasedChannel,
): Promise<void> => {
  try {
    await common(rollcallService, channel);
  } catch (error) {
    if (error instanceof RollcallAlreadyExistException) {
      await rollcallPull(rollcallService, channel);
    } else {
      throw error;
    }
  }
};

export const getOrCreateTodayRollcall = async (
  channel: GuildTextBasedChannel | TextBasedChannel,
  rollcallService: IRollcallService,
): Promise<IRollcall> => {
  let todayRollcall = await rollcallService.getToday(channel.id);
  if (!todayRollcall) {
    await channel.send(
      'There is no rollcall for today. I am creating one for you <3',
    );
    todayRollcall = await common(rollcallService, channel);
  }
  return todayRollcall;
};

export const sayHere = async (
  rollcallService: IRollcallService,
  username: string,
  channel: GuildTextBasedChannel | TextBasedChannel,
) => {
  try {
    const todayRollcall = await getOrCreateTodayRollcall(
      channel,
      rollcallService,
    );
    await rollcallService.addParticipant(todayRollcall, username);
    // TODO: In case the message got lost, it should create a new one
    if (todayRollcall.messageId) {
      const oldRollcallMessage = await channel.messages.fetch(
        todayRollcall.messageId,
      );
      await oldRollcallMessage.edit(createRollcallMessage(todayRollcall));
    }
  } catch (e) {
    if (e instanceof RollcallUserAlreadyRegisteredException) {
      await channel.send('You are already registered');
    } else if (e === 'Missing Permissions') {
      await channel.send(
        'I cannot delete messages. Please give me the right permission',
      );
    } else {
      await channel.send(`Something went wrong :/\n${e}`);
    }
  }
};

export const sayNotHere = async (
  rollcallService: IRollcallService,
  username: string,
  channel: GuildTextBasedChannel | TextBasedChannel,
) => {
  try {
    const todayRollcall = await getOrCreateTodayRollcall(
      channel,
      rollcallService,
    );
    await rollcallService.removeParticipant(todayRollcall, username);
    if (todayRollcall.messageId) {
      const oldRollcallMessage = await channel.messages.fetch(
        todayRollcall.messageId,
      );
      await oldRollcallMessage.edit(createRollcallMessage(todayRollcall));
    }
  } catch (e) {
    if (e instanceof RollcallUserAlreadyNotRegisteredException) {
      await channel.send("You are not registered in today's rollcall");
    } else if (e === 'Missing Permissions') {
      await channel.send(
        'I cannot delete messages. Please give me the right permission',
      );
    } else {
      console.error(e);
      await channel.send(`Something went wrong :/\n${e}`);
    }
  }
};
