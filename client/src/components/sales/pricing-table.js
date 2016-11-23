import React, { Component } from 'react';
import { Link } from 'react-router';

class PricingTable extends Component {
  render() {
    const componentStyle = {
      backgroundColor: this.props.color || '#5BC0DE',
      color: this.props.fontColor || '#FFF',
    };

    return (
      <div className="pricing-table">
        <div className="col-md-4 col-sm-6 col-xs-12 float-shadow">
          <div className="price_table_container">
            <div className="price_table_heading">{this.props.planName}</div>
            <div className="price_table_body">
              <div className="price_table_row cost" style={componentStyle}><strong>{this.props.price}</strong><span>/MONTH</span></div>
              {this.props.features.map((data, index) => <div key={`${data}-${index}`} className="price_table_row">
                {data}
              </div>)}
            </div>
            <Link to={`checkout/${(this.props.planName).toLowerCase()}`} className="btn btn-lg btn-block" style={componentStyle}>Subscribe!</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default PricingTable;
