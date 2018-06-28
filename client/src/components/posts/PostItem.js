import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { deletePost, addLike, removeLike } from '../../actions/postActions';

class PostItem extends Component { 
  state = {
    likes: this.props.post.likes.length,
    alreadyliked: this.props.post.likes.filter(like => like.user === this.props.auth.user.id).length > 0
  };
  
  render() {
    const { post, auth, showActions } = this.props;
    console.log(this.props);
    
    return (
      <div className="card card-body mb-3">
        <div className="row">

          <div className="col-md-2">
            <Link to="profile.html">
              <img 
                className="rounded-circle d-none d-md-block"                         
                src={post.avatar}
                alt="" />
            </Link>
            <br />
            <p className="text-center">{post.name}</p>
          </div>

          <div className="col-md-10">
            <p className="lead">{post.text}</p>

            {showActions && 
              <span>
                <button 
                  type="button" 
                  className="btn btn-light mr-1"
                  onClick={() => {
                    this.props.addLike(post._id);
                    if(!this.state.alreadyliked) {
                      this.setState((prevState) => ({
                        likes: prevState.likes + 1,
                        alreadyliked: true
                      }));
                    }
                  }}   
                >
                  <i className={classnames('fas fa-thumbs-up', {
                    'text-info': this.state.alreadyliked
                  })}></i>
                  <span className="badge badge-light">{this.state.likes}</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-light mr-1"
                  onClick={() => {
                    this.props.removeLike(post._id);
                    if(this.state.alreadyliked) {
                      this.setState(prevState => ({
                        likes: prevState.likes - 1,
                        alreadyliked: false
                      }));
                    }
                  }}   
                >
                  <i className="text-secondary fas fa-thumbs-down"></i>
                </button>

                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
              </span>
            }

            

            {post.user === auth.user.id && (
              <button 
                type="button" 
                className="btn btn-danger mr-1"
                onClick={() => {
                  this.props.deletePost(post._id);
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

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deletePost, addLike, removeLike })(PostItem);
