import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, SET_CURRENT_USER, GET_ERRORS } from './types';
import { getErrors } from './errorActions';

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios.get('/api/profile')
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
      dispatch(getErrors({}));
    })
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
    })
    .catch(err => dispatch(getErrors(err.response.data)));
};

// Add experience
export const addExperience = (expData, history) => dispatch => {
  axios.post('/api/profile/experience', expData)
    .then(res => {
      history.push('/dashboard');
    })
    .catch(err => dispatch(getErrors(err.response.data)));
}; 

// Add education
export const addEducation = (eduData, history) => dispatch => {
  axios.post('/api/profile/education', eduData)
    .then(res => {
      history.push('/dashboard');
    })
    .catch(err => dispatch(getErrors(err.response.data)));
}; 

// Delete Account & Profile
export const deleteAccount = () => dispatch => {
  if(window.confirm('Are you sure? This can NOT be undone!')) {
    axios.delete('/api/profile')
      .then(res => dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        }))
      .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }));
  }
};

// Profile Loading
export const setProfileLoading = () => ({
  type: PROFILE_LOADING
});

// Clear Profile
export const clearCurrentProfile = () => ({
  type: CLEAR_CURRENT_PROFILE
});

