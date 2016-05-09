import { FETCH_USER, EDIT_PROFILE_REQUEST } from '../actions/types';

const INITIAL_STATE = { profile: {}, message: '', error: '' };

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_USER:
      return { ...state, profile: action.payload };
    case EDIT_PROFILE_REQUEST:
      return { ...state, message: action.payload, error: action.payload };
  }

  return state;
}
