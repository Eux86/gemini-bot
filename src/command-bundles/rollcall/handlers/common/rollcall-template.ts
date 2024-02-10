import {
  Interaction,
  InteractionStyle,
} from '../../../../command-service/command-service.interface';

export const rollcallTemplate = (data: {
  participants: string[];
  notParticipants: string[];
}) => `
Rollcall started. Available commands: 
here: join the rollcall
not-here: remove your presence from the rollcall
rollcall-pull: pulls down the rollcall message

${data.participants.length} present${
  data.participants.length > 1 ? 's' : ''
}: ${data.participants.join(', ')}
${data.notParticipants.length} NOT present${
  data.participants.length > 1 ? 's' : ''
}: ${data.notParticipants.join(', ')}
`;

export const rollcallInteractions: Interaction[] = [
  {
    id: 'hereButton',
    label: '👍 Here',
    style: InteractionStyle.Primary,
  },
  {
    id: 'notHereButton',
    label: '👎 Not Here',
    style: InteractionStyle.Primary,
  },
  {
    id: 'pullDownButton',
    label: '👇 Pull Down',
    style: InteractionStyle.Secondary,
  },
];
