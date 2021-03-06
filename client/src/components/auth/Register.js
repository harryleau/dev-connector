import React, { Component } from 'react';
// prop-types to set type for properties
import PropTypes from 'prop-types';
// withRouter allows to use history in actions.
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';


class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {}
  }

  // use this lifecycle method will redirect to dashboard if user logged in and manually go to /register
  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  // whenever errors of redux state is passed to props through mapStateToProps, this lifecycle method will set the errors internal state of this component => dont need to change code below 
  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => {
    // set the target to all inputs, in this way we only need one method for all inputs change
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };
    // can pass history into action because of withRouter
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    // destructuring of const errors = this.state.errors;
    const { errors } = this.state;
    
    // use noValidate for the form to disable HTML default validation 
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              
              <form noValidate onSubmit={this.onSubmit}> 

                <TextFieldGroup 
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />

                <TextFieldGroup 
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                />

                <TextFieldGroup 
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />

                <TextFieldGroup 
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />

                <input type="submit" className="btn btn-info btn-block mt-4" />

              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

// this is a common React practice to set the type of properties ('func' as 'function')
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

// another way of mapDispatchToProps is passing the action into the returned obj to use as a prop like below
// add withRouter before Register component to use history in action.
export default connect(mapStateToProps, { registerUser })(withRouter(Register));
