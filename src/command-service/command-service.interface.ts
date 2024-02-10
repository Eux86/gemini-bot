import { CommandDescription } from '../types/command-handler';

export interface ICommandService {
  start(commands: CommandDescription[]): Promise<void>;
}

export interface IChannel {
  id: string;
  getMessage: (id: string) => Promise<IMessage>;
}

export interface IMessage {
  id: string;
  channel: IChannel | undefined;
  edit: (content: string) => Promise<IMessage>;
  delete: () => Promise<void>;
}

export interface ICommand {
  id: string;
  payload?: unknown;
  reply: (payload: ReplyPayload) => void;
}

export interface ReplyPayload {
  content: string;
  interactions?: Interaction[];
}

export interface Interaction {
  id: string;
  label: string;
  style: InteractionStyle;
}

export enum InteractionStyle {
  Primary = 'primary',
  Secondary = 'secondary',
}
