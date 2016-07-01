import axios from 'axios';
import { reset } from 'redux-form';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import io from 'socket.io-client';
import { AUTH_USER,
         ERROR_RESPONSE,
         UNAUTH_USER,
         FORGOT_PASSWORD_REQUEST,
         RESET_PASSWORD_REQUEST,
         CLEAR_ERRORS,
         PROTECTED_TEST,
         FETCH_USER,
         FETCH_CONVERSATIONS,
         FETCH_RECIPIENTS,
         START_CONVERSATION,
         SEND_CONTACT_FORM,
         SEND_REPLY,
         FETCH_SINGLE_CONVERSATION,
         CREATE_CUSTOMER,
         FETCH_CUSTOMER,
         CANCEL_SUBSCRIPTION,
         CHANGE_SUBSCRIPTION,
         UPDATE_BILLING } from './types';

const API_URL = 'http://localhost:3000/api';

// Connect to socket.io server
export const socket = io.connect('http://localhost:3000');

//================================
// Utility actions
//================================

export function errorHandler(error) {
  return {
    type: ERROR_RESPONSE,
    payload: error
  };
}

export function clearErrors() {
  return {
    type: CLEAR_ERRORS
  };
}

export function unauthError(response) {
  if (response.status === 401) {
    return logoutUser('Your session has expired. Please login again.');
  }

  console.log(response);
  return errorHandler(response.data);
}

export function fetchUser(uid) {
  return function(dispatch) {
    axios.get(`${API_URL}/user/${uid}`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: FETCH_USER,
        payload: response.data.user
      });
    })
    .catch(response => dispatch(errorHandler(response.data.error)))
  }
}

//================================
// Authentication actions
//================================

// TO-DO: Add expiration to cookie
export function loginUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${API_URL}/auth/login`, { email, password })
    .then(response => {
      cookie.save('token', response.data.token, { path: '/' });
      cookie.save('user', response.data.user, { path: '/' });
      dispatch({ type: AUTH_USER });
      browserHistory.push('/dashboard');
    })
    .catch(response => dispatch(errorHandler(response.data.error)));
    }
  }

export function registerUser({ email, firstName, lastName, password }) {
  return function(dispatch) {
    axios.post(`${API_URL}/auth/register`, { email, firstName, lastName, password })
    .then(response => {
      cookie.save('token', response.data.token, { path: '/' });
      cookie.save('user', response.data.user, { path: '/' });
      dispatch({ type: AUTH_USER });
      browserHistory.push('/register/profile');
    })
    .catch(response => dispatch(errorHandler(response.data.error)))
  }
}

export function logoutUser(error) {
  // Destroy token and user cookies
  cookie.remove('token', { path: '/' });
  cookie.remove('user', { path: '/' });

  // If an error was received, send it.
  errorHandler(error);

  // Redirect to home page on logout
  browserHistory.push('/');

  return({ type: UNAUTH_USER });
}

export function getForgotPasswordToken({ email }) {
  return function(dispatch) {
    axios.post(`${API_URL}/auth/forgot-password`, { email })
    .then(response => {
      dispatch({
        type: FORGOT_PASSWORD_REQUEST,
        payload: response.data.message
      });
    })
    .catch(response => dispatch(errorHandler(response.data.error)))
  }
}

export function resetPassword( token, { password }) {
  return function(dispatch) {
    axios.post(`${API_URL}/auth/reset-password/${token}`, { password })
    .then(response => {
      dispatch({
        type: RESET_PASSWORD_REQUEST,
        payload: response.data.message
      });
      // Redirect to login page on successful password reset
      browserHistory.push('/login');
    })
    .catch(response => dispatch(errorHandler(response.data.error)))
  }
}

export function protectedTest() {
  return function(dispatch) {
    axios.get(`${API_URL}/protected`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: PROTECTED_TEST,
        payload: response.data.content
      });
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

//================================
// Messaging actions
//================================
export function fetchConversations() {
  return function(dispatch) {
    axios.get(`${API_URL}/chat/conversation`, {
      headers: { 'Authorization': cookie.load('token'),
    'Access-Control-Allow-Credentials': 'true' }
    })
    .then(response => {
      dispatch({
        type: FETCH_CONVERSATIONS,
        payload: response.data.conversations
      });
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

export function fetchConversation(conversation) {
  return function(dispatch) {
    axios.get(`${API_URL}/chat/conversation/${conversation}`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: FETCH_SINGLE_CONVERSATION,
        payload: response.data.conversation
      });
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

export function startConversation({ recipient, composedMessage }) {
  return function(dispatch) {
    axios.post(`${API_URL}/chat/start-conversation/${recipient}`, {
      composedMessage
    }, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: START_CONVERSATION,
        payload: response.data.message
      });
      // Clear form after message is sent
      dispatch(reset('composeMessage'));
      browserHistory.push(`/dashboard/conversation/view/${response.data.conversationId}`);
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

export function fetchRecipients() {
  return function(dispatch) {
    axios.get(`${API_URL}/chat/recipients`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: FETCH_RECIPIENTS,
        payload: response.data
      });
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

export function sendReply(replyTo, { composedMessage }) {
  return function(dispatch) {
    axios.post(`${API_URL}/chat/conversation/${replyTo}`, {
      composedMessage
    }, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: SEND_REPLY,
        payload: response.data.message
      });
      // Clear form after message is sent
      dispatch(reset('replyMessage'));
      socket.emit('new message', replyTo);
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

//================================
// Static Page actions
//================================
export function sendContactForm({ firstName, lastName, emailAddress, subject, message}) {
  return function(dispatch) {
    axios.post(`${API_URL}/communication/contact`, { firstName, lastName, emailAddress, subject, message})
    .then(response => {
      dispatch({
        type: SEND_CONTACT_FORM,
        payload: response.data.message
      });
    })
    .catch(response => dispatch(errorHandler(response.data.error)))
  }
}

//================================
// Customer actions
//================================
export function createCustomer(stripeToken, plan, lastFour) {
  return function(dispatch) {
    axios.post(`${API_URL}/pay/customer`, { stripeToken, plan, lastFour },
    {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: CREATE_CUSTOMER,
        payload: response.data.message
      });
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

export function fetchCustomer() {
  return function(dispatch) {
    axios.get(`${API_URL}/pay/customer`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: FETCH_CUSTOMER,
        payload: response.data.customer
      });
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

export function cancelSubscription() {
  return function(dispatch) {
    axios.delete(`${API_URL}/pay/subscription`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: CANCEL_SUBSCRIPTION,
        payload: response.data.message
      });
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

export function updateSubscription(newPlan) {
  return function(dispatch) {
    axios.put(`${API_URL}/pay/subscription`, { newPlan },
    {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: CHANGE_SUBSCRIPTION,
        payload: response.data.message
      });
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}

export function updateBilling(stripeToken) {
  return function(dispatch) {
    axios.put(`${API_URL}/pay/customer`, { stripeToken },
    {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: UPDATE_BILLING,
        payload: response.data.message
      });
    })
    .catch((response) => {
      unauthError(response);
    });
  }
}
