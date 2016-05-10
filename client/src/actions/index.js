import axios from 'axios';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import { AUTH_USER,
         ERROR_RESPONSE,
         UNAUTH_USER,
         FORGOT_PASSWORD_REQUEST,
         RESET_PASSWORD_REQUEST,
         CLEAR_ERRORS,
         PROTECTED_TEST,
         FETCH_USER,
         FETCH_MESSAGES,
         EDIT_PROFILE_REQUEST } from './types';

const API_URL = 'http://localhost:3000/api';

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
    .catch(response => dispatch(errorHandler(response.data)))
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
      dispatch({ type: AUTH_USER });
      browserHistory.push('/dashboard');
    })
    .catch(function(response) {
      dispatch(errorHandler(response.data + '. Please try again.'));
    })
  }
}

export function registerUser({ email, firstName, lastName, password }) {
  return function(dispatch) {
    axios.post(`${API_URL}/auth/register`, { email, firstName, lastName, password })
    .then(response => {
      cookie.save('token', response.data.token, { path: '/' });
      cookie.save('uid', response.data.uid, { path: '/' });
      dispatch({ type: AUTH_USER });
      browserHistory.push('/dashboard');
    })
    .catch(response => dispatch(errorHandler(response.data.error)))
  }
}

export function logoutUser() {
  // Destroy token and user cookies
  cookie.remove('token', { path: '/' });
  cookie.remove('uid', { path: '/' });

  // Redirect to home page on logout
  browserHistory.push('/');

  return {
    type: UNAUTH_USER,
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

export function editUserProfile( uid, { gender, birthDate, units, height, weight,
  medication, allergy, heart, lung, diabetes, cancer, stroke, mental, injury,
  medicalOther, medicalMoreDetail, medicalOtherConcerns, occupation, smoke,
  drink, drugs, lifestyleExplanation, goal, nutrition, nutritionExplanation,
  enjoyedActivity, dumbbell, barbell, cardioMachine, resistanceMachine, medicineBall,
  resistanceBand, kettleBell, speedAgility, swimmingPool, equipmentExplanation
} ) {
  return function(dispatch) {
    axios.post(`${API_URL}/user/${uid}`, { gender, birthDate, units, height, weight,
      medication, allergy, heart, lung, diabetes, cancer, stroke, mental, injury,
      medicalOther, medicalMoreDetail, medicalOtherConcerns, occupation, smoke,
      drink, drugs, lifestyleExplanation, goal, nutrition, nutritionExplanation,
      enjoyedActivity, dumbbell, barbell, cardioMachine, resistanceMachine, medicineBall,
      resistanceBand, kettleBell, speedAgility, swimmingPool, equipmentExplanation
    })
    .then(response => {
      dispatch({
        type: EDIT_PROFILE_REQUEST,
        payload: response.data.message
      });
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
    .catch(response => dispatch(errorHandler(response.data.error)))
  }
}

//================================
// Messaging actions
//================================
export function fetchMessages() {
  return function(dispatch) {
    axios.get(`${API_URL}/chat/inbox`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: FETCH_MESSAGES,
        payload: response.data.messages
      });
    })
    .catch(response => dispatch(errorHandler(response.data.error)))
  }
}

//================================
// Contact Form actions
//================================
export function sendContactForm({ firstName, lastName, subject, message}) {
  return function(dispatch) {
    axios.get(`${API_URL}/communication/contact`, { firstName, lastName, subject, message})
    .then(response => {
      dispatch({
        type: SEND_CONTACT_FORM,
        payload: response.data.message
      });
    })
    .catch(response => dispatch(errorHandler(response.data.error)))
  }
}
