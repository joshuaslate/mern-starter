import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import * as actions from '../actions';

class Dashboard extends Component {

  componentDidMount() {
    this.props.clearErrors();
    this.props.protectedTest();
  }

  render() {
    return (
      <div>
        {this.props.content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { content: state.auth.content };
}

export default connect(mapStateToProps, actions)(Dashboard);
