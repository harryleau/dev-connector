import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import 'moment-timezone';
import { deleteEducation } from '../../actions/profileActions';

class Education extends Component {

  render() {
    const education = this.props.education.map(edu => (
      <tr key={edu._id}>
        <td>{edu.school}</td>
        <td>{edu.degree}</td>
        <td>{edu.fieldofstudy}</td>
        <td>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment> - {' '}
          {edu.to === null ? (' Now') : <Moment format="YYYY/MM/DD">{edu.to}</Moment>}
        </td>
        <td>
          <button 
            onClick={() => this.props.deleteEducation(edu._id)} 
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Education Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Field Of Study</th>
              <th>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {education}
          </tbody>
        </table>
      </div>
    );
  }
}

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired
}

export default connect(undefined, { deleteEducation })(Education);
