import { Message } from 'discord.js';

type DeepPartial<T> = T extends object ? {
  [key in keyof T]?: DeepPartial<T[key]>
}: T;

interface IProps {
  spySend?: jest.Mock,
  spyDelete?: jest.Mock,
}

export const mockDiscordMessage = ({
  spySend = jest.fn(),
  spyDelete = jest.fn(),
}: IProps): Message => {
  const mock: DeepPartial<Message> = ({
    id: 'mock-message-id',
    channel: {
      send: spySend,
      id: 'mock-channel',
      messages: {
        fetch: () => mockDiscordMessage({}),
      },
    },
    author: {
      username: 'mock-message-user',
    },
    delete: spyDelete,
  });
  return mock as Message;
};
