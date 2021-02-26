import { ICommand } from ".";
import { getService, Services } from "../service-factory";

const mapsInfo: ICommand = {
  name: 'maps-info',
  description: 'Returns info about the available servers maps',
  command: (msg: any, args: any) => {
      const mapsInfoService = getService(Services.MapsInfo);
      msg.channel.send(mapsInfoService.getAll());
  },
};

export default mapsInfo;