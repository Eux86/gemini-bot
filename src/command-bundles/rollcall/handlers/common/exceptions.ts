// eslint-disable-next-line max-classes-per-file
export class NoChannelInInteractionException extends Error {
  constructor() {
    super('No channel found for this interaction');
  }
}

export class NoRollcallExistsException extends Error {
  constructor() {
    super('No rollcall already exist');
  }
}

export class MessageNotFoundException extends Error {
  constructor() {
    super('Message not found');
  }
}
