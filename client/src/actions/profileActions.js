import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from './types';
import { getErrors } from './errorActions';

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios.get('/api/profile')
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_PROFILE,
      payload: {}
    }));
};

// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  axios.post('/api/profile', profileData)
    .then(res => {
      history.push('/dashboard');
      dispatch(getErrors({}));
    })
    .catch(err => dispatch(getErrors(err.response.data)));
};

// Profile Loading
export const setProfileLoading = () => ({
  type: PROFILE_LOADING
});

// Clear Profile
export const clearCurrentProfile = () => ({
  type: CLEAR_CURRENT_PROFILE
});