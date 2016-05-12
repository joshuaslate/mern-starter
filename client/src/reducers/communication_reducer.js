import { FETCH_MESSAGES, SEND_CONTACT_FORM, ERROR_RESPONSE } from '../actions/types';

const INITIAL_STATE = { messages: '', message: '', error: '' };

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_MESSAGES:
      return { ...state, messages: action.payload };
    case SEND_CONTACT_FORM:
      return { ...state, message: action.payload };
    case ERROR_RESPONSE:
      return { ...state, error: action.payload };
  }

  return state;
}
