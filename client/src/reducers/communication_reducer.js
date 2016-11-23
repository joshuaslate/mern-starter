import { FETCH_CONVERSATIONS, SEND_CONTACT_FORM, SEND_REPLY, START_CONVERSATION, FETCH_SINGLE_CONVERSATION, FETCH_RECIPIENTS, CHAT_ERROR } from '../actions/types';

const INITIAL_STATE = { conversations: [], message: '', messages: [], recipients: [], error: '' };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CONVERSATIONS:
      return { ...state, conversations: action.payload.conversations };
    case FETCH_SINGLE_CONVERSATION:
      return { ...state, messages: action.payload.conversation };
    case FETCH_RECIPIENTS:
      return { ...state, recipients: action.payload.recipients };
    case START_CONVERSATION:
      return { ...state, message: action.payload.message };
    case SEND_REPLY:
      return { ...state, message: action.payload.message };
    case SEND_CONTACT_FORM:
      return { ...state, message: action.payload.message };
    case CHAT_ERROR:
      return { ...state, error: action.payload };
  }

  return state;
}
