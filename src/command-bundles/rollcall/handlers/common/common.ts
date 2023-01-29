import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  Interaction,
  MessageCreateOptions,
} from 'discord.js';
import { IRollcall } from '../../types/rollcall';
import { IRollcallService } from '../../types/rollcall-service';
import { RollcallAlreadyExistException } from '../../services/errors';
import {
  NoChannelInInteractionException,
  NoRollcallExistsException,
} from './errors';

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

const getChannelIdFromInteraction = (interaction: Interaction): string => {
  let channelId: string | undefined;
  if (interaction.isChatInputCommand()) {
    channelId = interaction.channel?.id;
  }
  if (interaction.isButton()) {
    channelId = interaction.channelId;
  }
  if (!channelId) {
    throw new NoChannelInInteractionException();
  }
  return channelId;
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

const sendNewRollcallMessge = async (
  rollcallService: IRollcallService,
  interaction: ChatInputCommandInteraction | ButtonInteraction,
  todayRollcall: IRollcall,
) => {
  const message = createRollcallMessage(todayRollcall);
  const rollcallMessage = await interaction.editReply(message);

  await rollcallService.bindToMessage(todayRollcall, rollcallMessage);
};

const deleteMessageById = async (
  messageId: string,
  interaction: ChatInputCommandInteraction | ButtonInteraction,
) => {
  try {
    if (messageId) {
      const oldRollcallMessage = await interaction.channel?.messages.fetch(
        messageId,
      );
      await oldRollcallMessage?.delete();
    }
  } catch (e) {
    if ((e as any).code !== 10008) {
      throw e;
    }
  }
};

export const rollcallPull = async (
  rollcallService: IRollcallService,
  interaction: ChatInputCommandInteraction | ButtonInteraction,
): Promise<IRollcall> => {
  const channelId = getChannelIdFromInteraction(interaction);
  try {
    const todayRollcall = await rollcallService.getToday(channelId);
    if (!todayRollcall) {
      await interaction.editReply(
        'There is no rollcall for today. Create one first!',
      );
      throw new NoRollcallExistsException();
    }
    if (todayRollcall.messageId) {
      await deleteMessageById(todayRollcall.messageId, interaction);
    }
    await sendNewRollcallMessge(rollcallService, interaction, todayRollcall);
    return todayRollcall;
  } catch (e) {
    if (e instanceof RollcallAlreadyExistException) {
      const message =
        'Cannot start rollcall. A rollcall already exists for today: \n';
      await interaction.editReply(message);
      throw new Error(message);
    } else {
      const message = 'Something went wrong :/';
      await interaction.editReply(message);
      throw e;
    }
  }
};

export const startTodayRollcallAndSend = async (
  rollcallService: IRollcallService,
  interaction: ChatInputCommandInteraction | ButtonInteraction,
): Promise<IRollcall> => {
  if (!interaction.channel) {
    throw new NoChannelInInteractionException();
  }
  const todayRollcall = await rollcallService.startToday(
    interaction.channel.id,
  );
  await sendNewRollcallMessge(rollcallService, interaction, todayRollcall);
  return todayRollcall;
};

export const getOrCreateTodayRollcall = async (
  interaction: ChatInputCommandInteraction | ButtonInteraction,
  rollcallService: IRollcallService,
): Promise<IRollcall> => {
  const channelId = getChannelIdFromInteraction(interaction);
  let todayRollcall = await rollcallService.getToday(channelId);
  if (!todayRollcall) {
    await interaction.reply(
      'There is no rollcall for today. I am creating one for you <3',
    );
    todayRollcall = await startTodayRollcallAndSend(
      rollcallService,
      interaction,
    );
  }
  return todayRollcall;
};

export const createOrPullRollcall = async (
  rollcallService: IRollcallService,
  interaction: ChatInputCommandInteraction | ButtonInteraction,
) => {
  try {
    await interaction.deferReply();
    const channelId = getChannelIdFromInteraction(interaction);
    const todayRollcal = await rollcallService.getToday(channelId);
    if (!todayRollcal) {
      await startTodayRollcallAndSend(rollcallService, interaction);
    } else if (todayRollcal.messageId) {
      await rollcallPull(rollcallService, interaction);
    }
  } catch (e) {
    console.error(e);
    await interaction.reply(`Something went wrong :/\n${e}`);
  }
};
