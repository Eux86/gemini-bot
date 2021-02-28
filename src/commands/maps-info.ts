import { ICommand } from '.';
import { getService, Services } from '../service-factory';

const mapsInfo: ICommand = {
  name: 'maps',
  description: 'Returns info about the available servers maps',
  // eslint-disable-next-line no-unused-vars
  command: async (msg: any, _args: any) => {
    const mapsInfoService = getService(Services.MapsInfo);
    const response = await mapsInfoService.getAll();
    msg.channel.send(response);
  },
};

export default mapsInfo;
