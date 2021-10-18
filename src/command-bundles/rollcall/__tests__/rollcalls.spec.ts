import { RollcallService } from '../services/rollcall-service';
import { IRollcall } from '../types/rollcall';
import { RollcallRepo } from '../services/rollcall-repo';
import * as RollcallRepoModule from '../services/rollcall-repo';

const mockChannelName = 'mock-channel-name';
const mockedRollcalls: IRollcall[] = [
  {
    channelName: mockChannelName,
    messageId: undefined,
    date: new Date(1, 1, 2020),
    notParticipants: [],
    participants: [],
  },
  {
    channelName: mockChannelName,
    messageId: undefined,
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    notParticipants: [],
    participants: [],
  },
];

const spyGet = jest.fn().mockImplementation(() => Promise.resolve([]));
const spySet = jest.fn().mockImplementation(() => Promise.resolve());
jest.spyOn(RollcallRepoModule, 'RollcallRepo').mockReturnValue({
  set: spySet,
  get: spyGet,
} as unknown as RollcallRepo);

describe('Rollcalls', () => {
  afterEach(() => {
    RollcallService.teardown();
  });

  describe('no rollcalls are created', () => {
    it('should return undefined when getting today\'s rollcall', async () => {
      const manager = await RollcallService.getInstance();
      const todayRollcall = await manager.getToday(mockChannelName);

      expect(todayRollcall)
        .toBeUndefined();
    });

    it('should create a new rollcall successfully', async () => {
      const manager = await RollcallService.getInstance();
      await manager.startToday(mockChannelName);
      const todayRollcall = await manager.getToday(mockChannelName);

      expect(todayRollcall)
        .not
        .toBeUndefined();
    });
  });

  describe('A rollcall exists', () => {
    it('should throw an exception if a new rollcall is created', async () => {
      const manager = await RollcallService.getInstance();
      await manager.startToday(mockChannelName);

      await expect(async () => manager.startToday(mockChannelName)).rejects.toThrowError('ROLLCALL_ALREADY_EXISTS');
    });

    it('should not throw an exception adding a new participant if it doesn\'t exist already', async () => {
      const manager = await RollcallService.getInstance();
      await manager.startToday(mockChannelName);
      const todayRollcall = await manager.getToday(mockChannelName);

      expect(() => manager.addParticipant(todayRollcall!, 'xxx'))
        .not
        .toThrowError();
    });

    it('should throw an exception adding an already existing participant', async () => {
      const manager = await RollcallService.getInstance();
      await manager.startToday(mockChannelName);
      const todayRollcall = await manager.getToday(mockChannelName);
      await manager.addParticipant(todayRollcall!, 'xxx');

      await expect(() => manager.addParticipant(todayRollcall!, 'xxx'))
        .rejects
        .toThrowError();
    });

    it('should remove a registered participant if it exists', async () => {
      const manager = await RollcallService.getInstance();
      await manager.startToday(mockChannelName);
      const todayRollcall = await manager.getToday(mockChannelName);

      await expect(() => manager.removeParticipant(todayRollcall!, 'xxx'))
        .not
        .toThrowError();
      expect(manager.getParticipants(todayRollcall!).length).toBe(0);
      expect(manager.getNotParticipants(todayRollcall!)).toStrictEqual(['xxx']);
    });

    it('should throw an exception if participant is already not registered', async () => {
      const manager = await RollcallService.getInstance();
      await manager.startToday(mockChannelName);
      const todayRollcall = await manager.getToday(mockChannelName);
      await manager.removeParticipant(todayRollcall!, 'xxx');

      await expect(manager.removeParticipant(todayRollcall!, 'xxx'))
        .rejects
        .toThrowError();
    });
  });

  describe('Old rollcalls exist', () => {
    it('should remove old rollcalls when creating a new one', async () => {
      const manager = await RollcallService.getInstance();

      const yesterday = new Date(2000, 1, 1, 0, 0, 0);
      const today = new Date(2000, 1, 2, 0, 0, 0);

      // Saving the Date implementation to reset it at the end of the test
      const temp = global.Date;
      jest
        .spyOn(global, 'Date')
        .mockImplementationOnce(() => yesterday as unknown as string);
      await manager.startToday(mockChannelName);

      expect((await manager.get()).length)
        .toBe(1);

      jest
        .spyOn(global, 'Date')
        .mockImplementationOnce(() => today as unknown as string);
      await manager.startToday(mockChannelName);

      expect((await manager.get()).length)
        .toBe(1);

      // Restoring the original implementation of Date. For some reason this is not done by jest.
      global.Date = temp;
    });
  });

  describe('loads existing rollcalls', () => {
    it('should load an existing rollcall', async () => {
      spyGet.mockImplementationOnce(() => Promise.resolve<IRollcall[]>(mockedRollcalls));
      const manager = await RollcallService.getInstance();
      await expect(manager.get())
        .resolves
        .toBe(mockedRollcalls);
    });

    it('getToday should return today\'s rollcall that was previously loaded from repo', async () => {
      spyGet.mockImplementationOnce(() => Promise.resolve<IRollcall[]>(mockedRollcalls));
      const manager = await RollcallService.getInstance();
      const today = await manager.getToday(mockChannelName);
      expect(today)
        .not
        .toBeUndefined();
    });

    it('should add a participant to a rollcall loaded from repo', async () => {
      spyGet.mockImplementationOnce(() => Promise.resolve<IRollcall[]>(mockedRollcalls));
      const manager = await RollcallService.getInstance();
      const today = await manager.getToday(mockChannelName);
      await expect(manager.addParticipant(today!, 'xxx'))
        .resolves;
      const updatedToday = await manager.getToday(mockChannelName);
      expect(updatedToday!.participants).toStrictEqual(['xxx']);
    });

    it('should update the saved rollcalls when creating new rollcall', async () => {
      spySet.mockImplementationOnce(() => Promise.resolve());
      const manager = await RollcallService.getInstance();
      await manager.startToday(mockChannelName);
      expect(spySet).toBeCalled();
    });

    it('should update the saved rollcalls when adding participants', async () => {
      spySet.mockImplementationOnce(() => Promise.resolve([]));
      const manager = await RollcallService.getInstance();
      const today = await manager.startToday(mockChannelName);
      await manager.addParticipant(today, 'xxx');
      expect(spySet).toBeCalledTimes(2);
    });
  });
});
