/* eslint-disable no-console */
import { Firestore, Settings } from '@google-cloud/firestore';
import { IPollsRepo } from '../types/polls-repo';
import { IPoll } from '../types/poll';

export class PollsRepo implements IPollsRepo {
  private readonly config: Settings = {
    ignoreUndefinedProperties: true,
    projectId: process.env.project_id,
    credentials: {
      private_key: (process.env.private_key || '').replace(/\\n/gm, '\n'),
      client_email: process.env.client_email,
    },
  }

  private readonly firestore = new Firestore(this.config);

  get = async (): Promise<IPoll[] | undefined> => {
    const ref = this.firestore.collection('polls');
    const res = await ref.get();
    const docsData = res.docs.map((doc) => doc.data())[0];
    const pollsArray = Object.values(docsData || {});
    return pollsArray.map((data: any): IPoll => ({
      state: data.state,
      description: data.description,
      options: data.options,
      votes: data.votes,
      // eslint-disable-next-line no-underscore-dangle
      date: new Date(data.date._seconds * 1000),
      messageId: data.messageId,
      channelName: data.channelName,
    }));
  }

  set = async (polls: IPoll[]): Promise<void> => {
    const pollDocument = this.firestore.doc('polls/polls');
    const mapped = polls.reduce((acc, poll) => ({
      ...acc,
      [`${poll.channelName}_${poll.date.getTime()}`]: poll,
    }), {});
    console.log(mapped);
    await pollDocument.set(mapped);
  }
}
