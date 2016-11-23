import React, { Component } from 'react';

class SocialMediaBar extends Component {
  render() {
    return (
      <div className="social-bar">
        <ul>
          {this.props.socialNetworks.map((data, index) => <li key={`${data}-${index}`} className="social-icon">
            <a title={data.name} href={data.href}><img alt={data.name} src={data.img} /></a>
          </li>)}
        </ul>
      </div>
    );
  }
}

export default SocialMediaBar;
