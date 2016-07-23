import axios from 'axios';
import { reset } from 'redux-form';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import io from 'socket.io-client';
import { AUTH_USER,
         AUTH_ERROR,
         UNAUTH_USER,
         FORGOT_PASSWORD_REQUEST,
         RESET_PASSWORD_REQUEST,
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
         BILLING_ERROR,
         CHAT_ERROR,
         STATIC_ERROR,
         UPDATE_BILLING } from './types';

const API_URL = 'http://localhost:3000/api';
const CLIENT_ROOT_URL = 'http://localhost:8080';

// Connect to socket.io server
export const socket = io.connect('http://localhost:3000');

//================================
// Utility actions
//================================

export function errorHandler(dispatch, error, type) {
  let errorMessage = '';

  if(error.data.error) {
    errorMessage = error.data.error;
  } else {
    errorMessage = error.data;
  }

  if(error.status === 401) {
    dispatch({
      type: type,
      payload: 'You are not authorized to do this. Please login and try again.'
    });
    logoutUser();
  } else {
    dispatch({
      type: type,
      payload: errorMessage
    });
  }
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
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
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
      window.location.href = CLIENT_ROOT_URL + '/dashboard';
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
    }
  }

export function registerUser({ email, firstName, lastName, password }) {
  return function(dispatch) {
    axios.post(`${API_URL}/auth/register`, { email, firstName, lastName, password })
    .then(response => {
      cookie.save('token', response.data.token, { path: '/' });
      cookie.save('user', response.data.user, { path: '/' });
      dispatch({ type: AUTH_USER });
      window.location.href = CLIENT_ROOT_URL + '/dashboard';
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
  }
}

export function logoutUser(error) {
  return function (dispatch) {
    dispatch({ type: UNAUTH_USER });
    cookie.remove('token', { path: '/' });
    cookie.remove('user', { path: '/' });

    window.location.href = CLIENT_ROOT_URL + '/login';
  }
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
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
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
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
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
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
  }
}

//================================
// Messaging actions
//================================
export function fetchConversations() {
  return function(dispatch) {
    axios.get(`${API_URL}/chat/`, {
      headers: { 'Authorization': cookie.load('token'),
    'Access-Control-Allow-Credentials': 'true' }
    })
    .then(response => {
      dispatch({
        type: FETCH_CONVERSATIONS,
        payload: response.data.conversations
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, CHAT_ERROR)
    });
  }
}

export function fetchConversation(conversation) {
  return function(dispatch) {
    axios.get(`${API_URL}/chat/${conversation}`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: FETCH_SINGLE_CONVERSATION,
        payload: response.data.conversation
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, CHAT_ERROR)
    });
  }
}

export function startConversation({ recipient, composedMessage }) {
  return function(dispatch) {
    axios.post(`${API_URL}/chat/new/${recipient}`, {
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
    .catch((error) => {
      errorHandler(dispatch, error.response, CHAT_ERROR)
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
    .catch((error) => {
      errorHandler(dispatch, error.response, CHAT_ERROR)
    });
  }
}

export function sendReply(replyTo, { composedMessage }) {
  return function(dispatch) {
    axios.post(`${API_URL}/chat/${replyTo}`, {
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
    .catch((error) => {
      errorHandler(dispatch, error.response, CHAT_ERROR)
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
    .catch((error) => {
      errorHandler(dispatch, error.response, STATIC_ERROR)
    });
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
    .catch((error) => {
      errorHandler(dispatch, error.response, BILLING_ERROR)
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
    .catch((error) => {
      errorHandler(dispatch, error.response, BILLING_ERROR)
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
    .catch((error) => {
      errorHandler(dispatch, error.response, BILLING_ERROR)
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
    .catch((error) => {
      errorHandler(dispatch, error.response, BILLING_ERROR)
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
    .catch((error) => {
      errorHandler(dispatch, error.response, BILLING_ERROR)
    });
  }
}
