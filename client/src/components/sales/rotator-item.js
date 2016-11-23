import React, { Component } from 'react';

class RotatorItem extends Component {
  render() {
    return (
      <div className="slide">
        {this.props.selectedSlide.map((rotator, index) => (
          <div className="rotator-item" key={`${index}-${rotator.headline}`}>
            <img className="rotator-image" src={rotator.img} />
            {rotator.headline ? `<h3>${rotator.headline}</h3>` : ''}
            <div className="rotator-text-container">
              <p className="rotator-text">{rotator.text}</p>
              <p className="rotator-author">{rotator.author}</p>
            </div>
          </div>
          ))}
      </div>
    );
  }
}

export default RotatorItem;
