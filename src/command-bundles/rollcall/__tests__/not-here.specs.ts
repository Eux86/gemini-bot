import { RollcallService } from '../services/rollcall-service';
import { notHere } from '../handlers';
import { ITextCommand } from '../../../types/text-command';

const spyGetToday = jest.fn().mockReturnValue({});
jest.spyOn(RollcallService, 'getInstance').mockReturnValue(
  Promise.resolve({
    getToday: spyGetToday as unknown,
    removeParticipant: jest.fn() as unknown,
  } as RollcallService),
);

describe('not-here handler', () => {
  it('should return a disappointed message if a registered participant removes their presence', async () => {
    const spyReply = jest.fn();
    const spyDelete = jest.fn();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 100; i++) {
      // eslint-disable-next-line no-await-in-loop
      await notHere({
        discordMessage: {
          author: {},
          reply: spyReply as unknown,
          delete: spyDelete as unknown,
          channel: {
            send: jest.fn() as unknown,
          },
        },
      } as ITextCommand);
    }
    expect(spyReply.mock.calls.length).toBeLessThan(
      spyDelete.mock.calls.length,
    );
  });
});
