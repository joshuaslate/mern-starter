import React, { Component } from 'react';

import RotatorItem from './rotator-item';
import RotatorNav from './rotator-nav';

class Rotator extends Component {
  constructor(props) {
    super(props);

    this.setPage = this.setPage.bind(this);
    this.state = {
      index: 0,
    };
  }

  setPage(e) {
    this.setState({ index: e.target.value });
  }

  render() {
    const selectedSlide = this.props.rotators.filter(function (slider, index) {
      return index == this.state.index;
    }, this);

    return (
      <div className="rotator-container">
        <RotatorItem selectedSlide={selectedSlide} />
        <RotatorNav length={this.props.rotators.length} active={this.state.index} setPage={this.setPage} />
      </div>
    );
  }
}

export default Rotator;
