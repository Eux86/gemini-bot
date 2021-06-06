import { Firestore } from '@google-cloud/firestore';
import { IRollcall } from '../../models/rollcall';
import { IRollcallRepo } from '../interfaces/db-service';

export class RollcallRepo implements IRollcallRepo {
  private readonly firestore = new Firestore({ ignoreUndefinedProperties: true });

  public saveRollcall = async (rollcall: IRollcall) => {
    const {
      channelName, date, participants, notParticipants,
    } = rollcall;
    // const rollcallDocument = this.firestore.doc(`rollcalls/${channelName}_${date?.getTime()}`);
    // await rollcallDocument.set({
    //   channelName,
    //   date,
    //   participants,
    //   notParticipants,
    // });
  };

  public set = async (rollcalls: IRollcall[]) => {
    const rollcallDocument = this.firestore.doc('rollcalls/rollcalls');
    const mapped = rollcalls.reduce((acc, rollcall) => ({
      ...acc,
      [`${rollcall.channelName}_${rollcall.date.getTime()}`]: rollcall,
    }), {});
    console.log(mapped);
    await rollcallDocument.set(mapped);
  };

  public get = async (): Promise<IRollcall[]> => {
    const ref = this.firestore.collection('rollcalls');
    const res = await ref.get();
    const rollcallsArray = Object.values(res.docs.map((doc) => doc.data())[0]);
    const rollcalls = rollcallsArray.map((data: any): IRollcall => ({
      participants: data.participants,
      // eslint-disable-next-line no-underscore-dangle
      date: new Date(data.date._seconds * 1000),
      message: data.message,
      channelName: data.channelName,
      notParticipants: data.notParticipants,
    }));
    return rollcalls;
  };

  public deleteRollcall = async (rollcall: IRollcall) => {
    const { channelName, date } = rollcall;
    const rollcallDocument = this.firestore.doc(`rollcalls/${channelName}_${date?.getTime()}`);
    await rollcallDocument.delete();
  };

  public getRollcallByDateAndChannel = async (date: Date, channelName: string) => {
    const rollcallsRef = this.firestore.collection('rollcalls');
    let query = rollcallsRef.where('date', '==', date.getTime());
    query = query.where('channelName', '==', channelName);
    const res = await query.get();
    const todaysRef = res.docs[0]?.ref.path;
    if (!todaysRef) {
      return undefined;
    }
    const rollcall = await this.firestore.doc(todaysRef).get();
    return rollcall.data() as IRollcall;
  };
}
