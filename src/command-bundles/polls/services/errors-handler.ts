import { PollErrors } from '../types/errors';
import { errorMessages } from './error-messages';

export const handleError = async (
  error: Error,
  sendFunction: (message: string) => Promise<unknown>,
) => {
  const errorMessage = errorMessages[error.message as PollErrors];
  if (errorMessage) {
    await sendFunction(`Error: ${errorMessage}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(error);
    await sendFunction(`Error: ${error}`);
  }
};
