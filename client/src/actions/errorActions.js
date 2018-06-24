import { GET_ERRORS } from './types';

export const getErrors = (payload) => ({
  type: GET_ERRORS,
  payload
});