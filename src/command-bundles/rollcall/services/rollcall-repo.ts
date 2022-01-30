/* eslint-disable no-console */
import { Firestore, Settings } from '@google-cloud/firestore';
import { IRollcall } from '../types/rollcall';
import { IRollcallRepo } from '../types/rollcall-repo';

export class RollcallRepo implements IRollcallRepo {
  private readonly config: Settings = {
    ignoreUndefinedProperties: true,
    projectId: process.env.project_id,
    credentials: {
      private_key: (process.env.private_key || '').replace(/\\n/gm, '\n'),
      client_email: process.env.client_email,
    },
  };

  private readonly firestore = new Firestore(this.config);

  public set = async (rollcalls: IRollcall[]) => {
    const rollcallDocument = this.firestore.doc('rollcalls/rollcalls');
    const mapped = rollcalls.reduce(
      (acc, rollcall) => ({
        ...acc,
        [`${rollcall.channelName}_${rollcall.date.getTime()}`]: rollcall,
      }),
      {},
    );
    console.log(mapped);
    await rollcallDocument.set(mapped);
  };

  public get = async (): Promise<IRollcall[] | undefined> => {
    const ref = this.firestore.collection('rollcalls');
    const res = await ref.get();
    const rollcallsArray = Object.values(res.docs.map((doc) => doc.data())[0]);
    return rollcallsArray.map(
      (data: any): IRollcall => ({
        participants: data.participants,
        // eslint-disable-next-line no-underscore-dangle
        date: new Date(data.date._seconds * 1000),
        messageId: data.messageId,
        channelName: data.channelName,
        notParticipants: data.notParticipants,
      }),
    );
  };
}
