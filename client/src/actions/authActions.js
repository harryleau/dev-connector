import axios from 'axios';
import { getErrors } from './errorActions';
import setAuthToken from '../utils/setAuthToken';
// we dont have jwt module in client dir, and we only need to decode token => use jwt-decode
import jwt_decode from 'jwt-decode';
import { SET_CURRENT_USER } from './types';

// Register User
// because we included withRouter in Register component => we can use history here.
export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData)
    .then(res => {
      history.push('/login');
      // clear errors
      dispatch(getErrors({}));
    })
    .catch(err => dispatch(getErrors(err.response.data)));
};

// Login user
export const loginUser = userData => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      // Save to local storage
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      // set token to auth header
      setAuthToken(token);
      // decode token to get user data
      const decodedToken = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decodedToken));
      // clear errors
      dispatch(getErrors({}));
    })
    .catch(err => dispatch(getErrors(err.response.data)))
};

// Set logged in user
export const setCurrentUser = decodedToken => ({
  type: SET_CURRENT_USER,
  payload: decodedToken
});

// log user out
export const logoutUser = () => dispatch => {
  // remove token from localstorage
  localStorage.removeItem('jwtToken');
  // remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
}

