import { Firestore } from '@google-cloud/firestore';
import { Rollcall } from '../../models/rollcall';
import { IDbService } from '../interfaces/db-service';

export class DbService implements IDbService {
  private readonly firestore = new Firestore();

  public saveRollcall = async (rollcall: Rollcall) => {
    const {
      channelName, date, participants, notParticipants,
    } = rollcall;
    const rollcallDocument = this.firestore.doc(`rollcalls/${channelName}_${date?.getTime()}`);
    await rollcallDocument.set({
      channelName,
      date,
      participants,
      notParticipants,
    });
  };

  public deleteRollcall = async (rollcall: Rollcall) => {
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
    return rollcall.data() as Rollcall;
  };
}
