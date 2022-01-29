/* eslint-disable no-useless-constructor */
import { Message } from 'discord.js';
import { IPollsServce } from '../types/polls-service';
import { IPoll } from '../types/poll';
import { PollsRepo } from './polls-repo';
import { generatePollMessage, generatePollResultsMessage } from './response-templates';

export class PollsService implements IPollsServce {
  private static instance: PollsService | undefined;

  private repo = new PollsRepo();

  private polls: IPoll[] = [];

  // eslint-disable-next-line no-empty-function
  private constructor() { }

  public static getInstance = async () => {
    if (!PollsService.instance) {
      PollsService.instance = new PollsService();
      await PollsService.instance.init();
    }
    return PollsService.instance;
  }

  private init = async () => Promise.resolve()

  public create = async (channelName: string, description: string, options: string[] = []): Promise<IPoll> => {
    const olderPolls = this.polls.find((poll) => poll.channelName === channelName);
    if (olderPolls) {
      throw new Error('POLL_ALREADY_EXIST_IN_CHANNEL');
    }
    const newPoll: IPoll = {
      channelName,
      date: new Date(),
      description,
      options,
      votes: [],
      messageId: 'mock-message-id',
    };
    this.polls.push(newPoll);
    await this.updateRepo();
    return newPoll;
  }

  public bindToMessage = async (poll: IPoll, message: Message): Promise<void> => {
    // eslint-disable-next-line no-param-reassign
    poll.messageId = message.id;
    await this.repo.set(this.polls);
  }

  public addOption = async (channelName: string, description: string): Promise<IPoll> => {
    const foundPoll = this.polls.find((current) => current.channelName === channelName);
    if (!foundPoll) {
      throw new Error('POLL_DOES_NOT_EXIST_IN_CHANNEL');
    }
    foundPoll.options.push(description);
    await this.updateRepo();
    return foundPoll;
  }

  private updateRepo = async (): Promise<void> => this.repo.set(this.polls)

  public vote = async (channelName: string, userName: string, optionIndex: number): Promise<void> => {
    const foundPoll = this.polls.find((poll) => poll.channelName === channelName);
    if (!foundPoll) {
      throw new Error('POLL_DOES_NOT_EXIST_IN_CHANNEL');
    }
    foundPoll.votes.push({ userName, optionIndex });
    return this.updateRepo();
  };

  public generatePollMessage = (channelName: string) => {
    const foundPoll = this.polls.find((poll) => poll.channelName === channelName);
    if (!foundPoll) {
      throw new Error('POLL_DOES_NOT_EXIST_IN_CHANNEL');
    }
    return generatePollMessage(foundPoll.description, foundPoll.options);
  }

  public closeAndGetResultsMessage = async (channelName: string): Promise<string> => {
    const foundPoll = this.polls.find((poll) => poll.channelName === channelName);
    if (!foundPoll) {
      throw new Error('POLL_DOES_NOT_EXIST_IN_CHANNEL');
    }
    const message = generatePollResultsMessage(foundPoll.description, foundPoll.options, foundPoll.votes);
    this.polls.splice(this.polls.indexOf(foundPoll), 1);
    await this.updateRepo();
    return message;
  };
}
