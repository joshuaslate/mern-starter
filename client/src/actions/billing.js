import { getData, postData, putData, deleteData } from './index';
import { BILLING_ERROR, CREATE_CUSTOMER, FETCH_CUSTOMER, CANCEL_SUBSCRIPTION, CHANGE_SUBSCRIPTION, UPDATE_BILLING } from './types';

//= ===============================
// Customer actions
//= ===============================
export function createCustomer(stripeToken, plan, lastFour) {
  const data = { stripeToken, plan, lastFour };
  const url = '/pay/customer';
  return dispatch => postData(CREATE_CUSTOMER, BILLING_ERROR, true, url, dispatch, data);
}

export function fetchCustomer() {
  const url = '/pay/customer';
  return dispatch => getData(FETCH_CUSTOMER, BILLING_ERROR, true, url, dispatch);
}

export function cancelSubscription() {
  const url = '/pay/customer';
  return dispatch => getData(CANCEL_SUBSCRIPTION, BILLING_ERROR, true, url, dispatch);
}

export function updateSubscription(newPlan) {
  const data = { newPlan };
  const url = '/pay/subscription';
  return dispatch => putData(CHANGE_SUBSCRIPTION, BILLING_ERROR, true, url, dispatch, data);
}

export function updateBilling(stripeToken) {
  const data = { stripeToken };
  const url = '/pay/customer';
  return dispatch => putData(UPDATE_BILLING, BILLING_ERROR, true, url, dispatch, data);
}
