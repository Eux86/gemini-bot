import { combatBoxHomeMock } from '../../../../__mocks__/combat-box-home';
import { IMapsInfo } from '../types/maps-info';
import { IHttpHelperService } from '../types/http-helper-service';
import { CboxParser } from '../parsers/cbox-parser';

describe('Maps info', () => {
  it('Inteprets combat box html correctly', async () => {
    const mockHttpHelper: IHttpHelperService = {
      getPageContent: () => Promise.resolve(combatBoxHomeMock),
    };
    const cboxParser = new CboxParser(mockHttpHelper);
    const mapsInfo = await cboxParser.getMapsInfo();

    const expectedValue: IMapsInfo = {
      currentMapName: 'Crimean-Offensive-Apr-1944',
      nextMapName: 'Operation-Paravane-Sep-1944',
      remainingTime: '1 hours 21 minutes remaining',
    };

    expect(mapsInfo).toEqual(expectedValue);
  });
});
