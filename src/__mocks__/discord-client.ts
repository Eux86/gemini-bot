import { Message } from 'discord.js';

/** Mocked discord client
 * Allows to the bot to register a generic "on" event
 * This event can be fired when the "fireUserChatMessageReceived" function is called
 */
export class MockClient {
  static registered: ((msg: Message) => void)[] = [];

  channels = {
    cache: [],
  };

  on = (eventType: string, callback: ((msg: Message) => void)): this => {
    MockClient.registered.push(callback);
    return this;
  };

  login = jest.fn();

  static fireUserChatMessageReceived = (msg: Message) => MockClient.registered.forEach((callback) => callback(msg));
}
