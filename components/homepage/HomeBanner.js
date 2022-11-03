import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { trackSelectPromotion as dispatchTrackSelectPromotion} from '../../store/actions/analyticsActions';

function HomeBanner(props) {
  return (
    <div className="p-5">
      <p
        className="font-size-display1 mt-5 text-center mx-auto text-uppercase"
        style={{ maxWidth: '53rem' }}
      >
        Moisture is the essence of wetness, and wetness is the essence of beauty.
      </p>
      <div className="d-flex align-items-center justify-content-center mt-3 mb-5">
        <Link href="/about">
          <a
            className="d-flex py-3 align-items-center font-color-black borderbottom border-color-black"
            onClick={() => props.dispatchTrackSelectPromotion('about', 'About Link', 'none', 'default', 'below-hero')}>
            <p className="mr-3">Find out more</p>
            <img src="/icon/arrow-long-right.svg" />
          </a>
        </Link>
      </div>
    </div>
  );
}

export default connect(state => state, {dispatchTrackSelectPromotion})(HomeBanner)