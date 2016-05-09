import { FETCH_MESSAGES } from '../actions/types';

const INITIAL_STATE = { messages: ''}

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_MESSAGES:
      return { ...state, messages: action.payload };
  }

  return state;
}
