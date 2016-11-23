import React, { Component } from 'react';

class RotatorNav extends Component {
  renderNav() {
    const toMap = [];

    for (let i = 0; i < this.props.length; i++) {
      toMap.push(
        <li
          key={`${i}nav`}
          value={i}
          className={i == this.props.active ? 'slider-nav-bullet active' : 'slider-nav-bullet'}
          onClick={this.props.setPage}
        />,
      );
    }
    return toMap;
  }

  render() {
    return (
      <ul>
        {this.renderNav()}
      </ul>
    );
  }
}

export default RotatorNav;
