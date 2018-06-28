import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteComment } from "../../actions/postActions";
import { Link } from 'react-router-dom';

class CommentItem extends Component {
  render() {
    const { comment, postId, auth } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">

          <div className="col-md-2">
            <Link to="/profiles">
              <img
                className="rounded-circle d-none d-md-block"
                src={comment.avatar}
                alt=""
              />
            </Link>
            <br />
            <p className="text-center">{comment.name}</p>
          </div>

          <div className="col-md-10">
            <p className="lead">
              {comment.text}
            </p>

            {comment.user === auth.user.id && (
              <button 
                type="button" 
                className="btn btn-danger mr-1"
                onClick={() => {
                  this.props.deleteComment(postId, comment._id);
                }}
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);
