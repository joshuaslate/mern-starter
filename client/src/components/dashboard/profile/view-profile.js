import React, { Component } from 'react';
import cookie from 'react-cookie';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import UserInfo from './user-info';

class ViewProfile extends Component {
  componentWillMount() {
    // Fetch user data prior to component mounting
    const userId = cookie.load('uid');
    this.props.fetchUser(userId);
  }

  render() {
    return (
      <UserInfo profile={this.props.profile.email} />
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.user.profile
  }
}

export default connect(mapStateToProps, actions)(ViewProfile);
