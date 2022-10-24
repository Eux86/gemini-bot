import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { IRollcall } from '../../types/rollcall';
import { IRollcallService } from '../../types/rollcall-service';

export const createRollCall = async (
  rollcallService: IRollcallService,
  channel: TextChannel | DMChannel | NewsChannel,
): Promise<IRollcall> => {
  const todayRollcall = await rollcallService.startToday(channel.id);
  const messageContent = rollcallService.generateMessageContent(todayRollcall);
  const rollcallMessage = await channel.send(messageContent);
  await rollcallService.bindToMessage(todayRollcall, rollcallMessage);
  return todayRollcall;
};

export const getOrCreateTodayRollcall = async (
  channel: TextChannel | DMChannel | NewsChannel,
  rollcallService: IRollcallService,
): Promise<IRollcall> => {
  let todayRollcall = await rollcallService.getToday(channel.id);
  if (!todayRollcall) {
    await channel.send(
      'There is no rollcall for today. I am creating one for you <3',
    );
    todayRollcall = await createRollCall(rollcallService, channel);
  }
  return todayRollcall;
};
