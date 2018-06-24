import axios from 'axios';

// axios allows to set default headers => more efficient than fetch
const setAuthToken = (token) => {
  if(token) {
    // Apply to every request
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    // delete the auth header - delete keyword is to delete a prop from an obj
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default setAuthToken;