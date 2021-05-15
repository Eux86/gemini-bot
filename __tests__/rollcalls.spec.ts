import { RollcallService } from '../src/services/rollcall-service/rollcall-service';

describe('Rollcalls', () => {
  const mockChannelName = 'mock-channel-name';

  describe('no rollcalls are created', () => {
    it('should return undefined when getting today\'s rollcall', async () => {
      const manager = new RollcallService();

      const todayRollcall = manager.getToday(mockChannelName);

      expect(todayRollcall)
        .toBeUndefined();
    });

    it('should create a new rollcall successfully', async () => {
      const manager = new RollcallService();

      manager.startToday(mockChannelName);
      const todayRollcall = manager.getToday(mockChannelName);

      expect(todayRollcall)
        .not
        .toBeUndefined();
    });
  });

  describe('A rollcall exists', () => {
    const manager = new RollcallService();
    manager.startToday(mockChannelName);
    const todayRollcall = manager.getToday(mockChannelName);

    it('should throw an exception if a new rollcall is created', () => {
      expect(() => manager.startToday(mockChannelName)).toThrowError('ROLLCALL_ALREADY_EXISTS');
    });

    it('should not throw an exception adding a new participant if it doesn\'t exist already', () => {
      expect(() => todayRollcall?.addParticipant('xxx'))
        .not
        .toThrowError();
    });

    it('should throw an exception adding an already existing participant', () => {
      expect(() => todayRollcall?.addParticipant('xxx'))
        .toThrowError();
    });

    it('should remove a registered participant if it exists', () => {
      expect(() => todayRollcall?.removeParticipant('xxx'))
        .not
        .toThrowError();
      expect(todayRollcall?.getParticipants().length).toBe(0);
      expect(todayRollcall?.getNotParticipants()).toStrictEqual(['xxx']);
    });

    it('should throw an exception if participant is already not registered', () => {
      expect(() => todayRollcall?.removeParticipant('xxx'))
        .toThrowError();
    });
  });

  describe('old rollcalls exist', () => {
    it('should remove old rollcalls when creating a new one', () => {
      const manager = new RollcallService();

      const yesterday = new Date(2000, 1, 1, 0, 0, 0);
      const today = new Date(2000, 1, 2, 0, 0, 0);

      jest
        .spyOn(global, 'Date')
        .mockImplementation(() => yesterday as unknown as string);
      manager.startToday(mockChannelName);

      expect(manager.getAll().length)
        .toBe(1);

      jest
        .spyOn(global, 'Date')
        .mockImplementation(() => today as unknown as string);
      manager.startToday(mockChannelName);

      expect(manager.getAll().length)
        .toBe(1);
    });
  });
});
