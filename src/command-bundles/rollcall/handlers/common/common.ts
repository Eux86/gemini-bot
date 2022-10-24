import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  GuildTextBasedChannel,
  Message,
  MessageCreateOptions,
  TextBasedChannel,
} from 'discord.js';
import { IRollcall } from '../../types/rollcall';
import { IRollcallService } from '../../types/rollcall-service';
import { RollcallAlreadyExistException } from '../../services/errors';

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
  const pullDownButton = new ButtonBuilder()
    .setCustomId('pullDownButton')
    .setLabel('👇 Pull Down')
    .setStyle(ButtonStyle.Secondary);
  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(hereButton)
    .addComponents(notHereButton)
    .addComponents(pullDownButton);
  return [row];
};

export const createRollcallMessage = (
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
    if (todayRollcall.messageId) {
      const oldRollcallMessage = await channel.messages.fetch(
        todayRollcall.messageId,
      );
      await oldRollcallMessage.delete();
    }
    await sendRollcallMessge(rollcallService, channel, todayRollcall);
  } catch (e) {
    if (e instanceof RollcallAlreadyExistException) {
      await channel.send(
        'Cannot start rollcall. A rollcall already exists for today: \n',
      );
    } else {
      console.error(e);
      await channel.send('Something went wrong :/');
    }
  }
};

export const startTodayRollcallAndSend = async (
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
    await startTodayRollcallAndSend(rollcallService, channel);
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
    todayRollcall = await startTodayRollcallAndSend(rollcallService, channel);
  }
  return todayRollcall;
};

export const updateExistingRollcall = async (
  discordMessage: Message,
  todayRollcall: IRollcall,
) => {
  if (todayRollcall.messageId) {
    const oldRollcallMessage = await discordMessage.channel.messages.fetch(
      todayRollcall.messageId,
    );
    await oldRollcallMessage.edit(createRollcallMessage(todayRollcall));
  }
};

export const createOrPullRollcallFromInteraction = async (
  rollcallService: IRollcallService,
  interaction: ChatInputCommandInteraction | ButtonInteraction,
) => {
  try {
    const { channel } = interaction;
    if (!channel) throw new Error('No channel in message');
    let todayRollcal = await rollcallService.getToday(channel.id);
    if (!todayRollcal) {
      todayRollcal = await rollcallService.create(channel.id);
    } else if (todayRollcal.messageId) {
      try {
        const oldRollcallMessage = await interaction.channel?.messages.fetch(
          todayRollcal.messageId,
        );
        await oldRollcallMessage?.delete();
      } catch (error) {
        if ((error as any)?.code !== 10008) throw error; // Message not found
      }
    }
    const content = createRollcallMessage(todayRollcal);
    const newMessage = await interaction.reply({
      content: content.content,
      components: content.components,
      fetchReply: true,
    });
    await rollcallService.bindToMessage(todayRollcal, newMessage);
  } catch (e) {
    console.error(e);
    await interaction.reply(`Something went wrong :/\n${e}`);
  }
};
