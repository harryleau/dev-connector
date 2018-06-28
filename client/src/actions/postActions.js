import axios from 'axios';
import { ADD_POST, GET_POSTS, GET_POST, POST_LOADING, DELETE_POST } from './types';
import { getErrors, clearErrors } from './errorActions';

// add post
export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  axios.post('/api/posts', postData)
    .then(res => dispatch({
      type: ADD_POST,
      payload: res.data
    }))
    .catch(err => dispatch(getErrors(err.response.data)));
};

// get posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios.get('/api/posts')
    .then(res => dispatch({
      type: GET_POSTS,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_POSTS,
      payload: null
    }));
};

// delete posts
export const deletePost = id => dispatch => {
  axios.delete(`/api/posts/${id}`)
    .then(res => dispatch({
      type: DELETE_POST,
      payload: id
    }))
    .catch(err => dispatch(getErrors(err.response.data)));
};

// get post by id
export const getPost = (id) => dispatch => {
  dispatch(setPostLoading());
  axios.get(`/api/posts/${id}`)
    .then(res => dispatch({
      type: GET_POST,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_POST,
      payload: null
    }));
};

// Add like
export const addLike = postId => dispatch => {
  axios.post(`/api/posts/like/${postId}`)
    .then(res => res.data)
    .catch(err => dispatch(getErrors(err.response.data)));
};

// remove like
export const removeLike = postId => dispatch => {
  axios.post(`/api/posts/unlike/${postId}`)
    .then(res => res.data)
    .catch(err => dispatch(getErrors(err.response.data)));
};

// set loading state
export const setPostLoading = () => ({
  type: POST_LOADING
});

// add comment
export const addComment = (postId, comment) => dispatch => {
  dispatch(clearErrors());
  axios.post(`/api/posts/comment/${postId}`, comment)
    .then(res => dispatch({
      type: GET_POST,
      payload: res.data
    }))
    .catch(err => dispatch(getErrors(err.response.data)));
};

// delete posts
export const deleteComment = (postId, commentId) => dispatch => {
  dispatch(clearErrors());
  axios.delete(`/api/posts/comment/${postId}/${commentId}`)
    .then(res => dispatch(getPost(postId)))
    .catch(err => dispatch(getErrors(err.response.data)));
};