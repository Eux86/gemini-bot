export class RollcallAlreadyExistException extends Error {
  constructor() {
    super('ROLLCALL_ALREADY_EXISTS');
  }
}

export class RollcallUserAlreadyRegisteredException extends Error {
  constructor() {
    super('ALREADY_REGISTERED');
  }
}

export class RollcallUserAlreadyNotRegisteredException extends Error {
  constructor() {
    super('ALREADY_NOT_REGISTERED');
  }
}
