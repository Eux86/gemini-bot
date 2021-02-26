import { ICommand } from ".";
import { getService, Services } from "../service-factory";

const mapsInfo: ICommand = {
  name: 'map-info',
  description: 'Returns info about the available servers maps',
  command: async (msg: any, args: any) => {
      const mapsInfoService = getService(Services.MapsInfo);
      const response = await mapsInfoService.getAll();
      msg.channel.send(response);
  },
};

export default mapsInfo;