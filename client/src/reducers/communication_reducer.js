import { FETCH_MESSAGES, SEND_CONTACT_FORM } from '../actions/types';

const INITIAL_STATE = { messages: ''}

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_MESSAGES:
      return { ...state, messages: action.payload };
    case SEND_CONTACT_FORM:
      return { ...state, message: action.payload };
  }

  return state;
}
