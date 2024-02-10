export class ErrorHandler {
  handle(error: Error | unknown, message: string) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(new Error(String(error)));
    }
    return message;
  }
}
