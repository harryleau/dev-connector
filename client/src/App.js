import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import PrivateRoute from './components/common/PrivateRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import NotFound from './components/not-found/NotFound';

import './App.css';

// As the auth state will be clear if user refesh the app after logging in, we set the token from localstorage to the auth state in the app root, so user can stay logged-in in every route.
// check for token
if(localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // decode token and get user info and exp
  const decodedToken = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decodedToken));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if(decodedToken.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // clear current profile
    store.dispatch(clearCurrentProfile());
    // redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Route path="/" component={Landing} exact />
            <div className="container">
              <Switch>
                <Route path="/register" component={Register} exact />
                <Route path="/login" component={Login} exact />
                <Route path="/profiles" component={Profiles} exact />
                <Route path="/profile/:handle" component={Profile} exact />
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <PrivateRoute path="/create-profile" component={CreateProfile} exact />
                <PrivateRoute path="/edit-profile" component={EditProfile} exact />
                <PrivateRoute path="/add-experience" component={AddExperience} exact />
                <PrivateRoute path="/add-education" component={AddEducation} exact />
                <Route path="/not-found" component={NotFound} exact />
                <Route component={NotFound} />
              </Switch>
              </div>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
