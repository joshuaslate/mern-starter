import React, { Component } from 'react';

class UserInfo extends Component {
  render() {
    return (
      <div>
        {this.props.profile}
      </div>
    );
  }
}

export default UserInfo;
