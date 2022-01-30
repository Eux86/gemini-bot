/* eslint-disable no-useless-constructor */
import { Message } from 'discord.js';
import { IPollsServce } from '../types/polls-service';
import { IPoll, PollState } from '../types/poll';
import { PollsRepo } from './polls-repo';
import { generatePollMessage } from './response-templates';
import { PollErrors } from '../types/errors';

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

  private removeClosedPolls = async () => {
    const closedPolls = this.polls.filter((poll) => poll.state === PollState.Closed);
    closedPolls.forEach((toRemove) => {
      const indexOfPollToRemove = this.polls.indexOf(toRemove);
      this.polls.splice(indexOfPollToRemove, 1);
    });
    await this.updateRepo();
  }

  public create = async (channelName: string, description: string, options: string[] = []): Promise<IPoll> => {
    await this.removeClosedPolls();

    const olderPolls = this.polls.find((poll) => poll.channelName === channelName);
    if (olderPolls) {
      throw new Error(PollErrors.POLL_ALREADY_EXIST_IN_CHANNEL);
    }
    if (!description) {
      throw new Error(PollErrors.POLL_CREATION_NO_DESCRIPTION_PROVIDED);
    }
    const newPoll: IPoll = {
      channelName,
      date: new Date(),
      description,
      options,
      votes: [],
      messageId: 'mock-message-id',
      state: PollState.Open,
    };
    this.polls.push(newPoll);
    await this.updateRepo();
    return newPoll;
  }

  public bindToMessage = async (poll: IPoll, message: Message): Promise<IPoll> => {
    // eslint-disable-next-line no-param-reassign
    poll.messageId = message.id;
    await this.repo.set(this.polls);
    return poll;
  }

  public addOption = async (channelName: string, description: string): Promise<IPoll> => {
    if (!description) {
      throw new Error(PollErrors.POLL_ADD_OPTION_NO_DESCRIPTION_PROVIDED);
    }
    const foundPoll = this.getPollByChannel(channelName);
    foundPoll.options.push(description);
    await this.updateRepo();
    return foundPoll;
  }

  public vote = async (channelName: string, userName: string, optionIndex: number): Promise<IPoll> => {
    const foundPoll = this.polls.find((poll) => poll.channelName === channelName);
    if (!foundPoll) {
      throw new Error(PollErrors.POLL_DOES_NOT_EXIST_IN_CHANNEL);
    }
    if (!foundPoll.votes.find((vote) => vote.userName === userName && vote.optionIndex === optionIndex)) {
      foundPoll.votes.push({
        userName,
        optionIndex,
      });
    } else {
      throw new Error(PollErrors.POLL_VOTE_ALREADY_EXISTS);
    }
    await this.updateRepo();
    return foundPoll;
  };

  public unVote = async (channelName: string, userName: string, optionIndex: number): Promise<IPoll> => {
    const foundPoll = this.polls.find((poll) => poll.channelName === channelName);
    if (!foundPoll) {
      throw new Error(PollErrors.POLL_DOES_NOT_EXIST_IN_CHANNEL);
    }
    const existingVote = foundPoll.votes.find((vote) => vote.userName === userName && vote.optionIndex === optionIndex);
    if (!existingVote) {
      throw new Error(PollErrors.POLL_VOTE_DOES_NOT_EXIST);
    } else {
      foundPoll.votes.splice(foundPoll.votes.indexOf(existingVote), 1);
    }
    await this.updateRepo();
    return foundPoll;
  };

  public generatePollMessage = (channelName: string): string => {
    const foundPoll = this.polls.find((poll) => poll.channelName === channelName);
    if (!foundPoll) {
      throw new Error(PollErrors.POLL_DOES_NOT_EXIST_IN_CHANNEL);
    }
    return generatePollMessage(foundPoll);
  }

  public close = async (channelName: string): Promise<IPoll> => {
    const foundPoll = this.polls.find((poll) => poll.channelName === channelName);
    if (!foundPoll) {
      throw new Error(PollErrors.POLL_DOES_NOT_EXIST_IN_CHANNEL);
    }
    foundPoll.state = PollState.Closed;
    await this.updateRepo();
    return foundPoll;
  };

  public getPollByChannel = (channelName: string): IPoll => {
    const foundPoll = this.polls.find((current) => current.channelName === channelName);
    if (!foundPoll) {
      throw new Error(PollErrors.POLL_DOES_NOT_EXIST_IN_CHANNEL);
    }
    return foundPoll;
  }

  private updateRepo = async (): Promise<void> => this.repo.set(this.polls)
}
