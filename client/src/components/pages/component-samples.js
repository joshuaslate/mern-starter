import React, { Component } from 'react';

import PricingTable from '../sales/pricing-table';
import SocialMediaBar from '../sales/social-media-bar';
import Rotator from '../sales/rotator';

const bronzeFeatures = ['Really cool', 'Pretty cheap', 'Awesome'];
const silverFeatures = ['A couple features', 'Pretty neat'];
const goldFeatures = ['A bit cooler yet'];
const social = [
  {
    name: 'Facebook',
    href: 'http://facebook.com/',
    img: 'http://localhost:8080/src/public/img/icons/facebook.svg',
  },
  {
    name: 'Twitter',
    href: 'http://twitter.com/',
    img: 'http://localhost:8080/src/public/img/icons/twitter.svg',
  },
];

const rotators = [
  {
    img: '',
    headline: '',
    text: 'I love React!',
    author: 'JS',
  },
  {
    img: '',
    headline: '',
    text: 'MERN stack is pretty cool.',
    author: 'DM',
  },
];

class ComponentSamplesPage extends Component {
  render() {
    return (
      <div className="select-plan">
        <div className="row">
          <PricingTable planName="Bronze" color="#CCC" price="$10" features={bronzeFeatures} />
          <PricingTable planName="Silver" price="$15" features={silverFeatures} />
          <PricingTable planName="Gold" price="$20" features={goldFeatures} />
        </div>

        <SocialMediaBar socialNetworks={social} />

        <Rotator rotators={rotators} />
      </div>
    );
  }
}

export default ComponentSamplesPage;
