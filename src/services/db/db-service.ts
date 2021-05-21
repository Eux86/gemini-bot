import { Rollcall } from '../rollcall-service/rollcall';
import { IDbService } from '../interfaces/db-service';

const { Firestore } = require('@google-cloud/firestore');

export class DbService implements IDbService {
  private readonly firestore = new Firestore();

  public saveRollcall = async (rollcall: Rollcall) => {
    const { channelName, date } = rollcall;
    const rollcallDocument = this.firestore.doc(`rollcalls/${channelName}_${date?.getTime()}`);
    await rollcallDocument.set({
      channelName,
      date,
      participants: rollcall.getParticipants(),
      nonParticipants: rollcall.getNotParticipants(),
    });
  };

  public deleteRollcall = async (rollcall: Rollcall) => {
    const { channelName } = rollcall;
    const rollcallDocument = this.firestore.doc(`rollcalls/${channelName}_${date?.getTime()}`);
    rollcallDocument.delete();
  };
}
