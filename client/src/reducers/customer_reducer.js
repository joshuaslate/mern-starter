import { CREATE_CUSTOMER, BILLING_ERROR, FETCH_CUSTOMER, CANCEL_SUBSCRIPTION, CHANGE_SUBSCRIPTION, UPDATE_BILLING } from '../actions/types';

const INITIAL_STATE = { message: '', error: '', customer: {} };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_CUSTOMER:
      return { ...state, message: action.payload.message };
    case FETCH_CUSTOMER:
      return { ...state, customer: action.payload.customer };
    case CANCEL_SUBSCRIPTION:
      return { ...state, message: action.payload.message };
    case CHANGE_SUBSCRIPTION:
      return { ...state, message: action.payload.message };
    case UPDATE_BILLING:
      return { ...state, message: action.payload.message };
    case BILLING_ERROR:
      return { ...state, error: action.payload };
  }

  return state;
}
