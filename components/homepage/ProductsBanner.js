import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ProductRow from '../products/ProductRow';
import { connect } from 'react-redux';
import {
  trackViewItemList,
  trackSelectItem
} from '../../store/actions/analyticsActions';


class ProductsBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: {
        name: 'PLP: Homepage Products',
        id:'plp-homepage-products'
      },
      viewItemListFired: false
    }
    this.handleViewItemList = this.handleViewItemList.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this)
  }
  componentDidMount() {
    if(this.props.products.length > 0) {
      this.handleViewItemList();
    }
  }
  componentDidUpdate(prevProps){
    if(prevProps.products !== this.props.products && !this.state.viewItemListFired){
      this.handleViewItemList();
    }
  }
  handleViewItemList() {
    this.props.dispatch(trackViewItemList(this.props.products.slice(0,4), this.state.list))
      .then(() => this.setState({viewItemListFired: true}));
  }
  handleSelectItem(id, position) {
    const products = this.props.products.filter(prod => prod.id === id);
    this.props.dispatch(trackSelectItem(products, position, this.state.list))
  }
  render() {
    const { products } = this.props;
    
    return (
      <div className="custom-container py-5 my-5">
        <div className="d-flex flex-column align-items-center mb-5 pb-4">
          <p className="font-color-medium mb-4">
            Introducing Our Latest Products
          </p>
          <p
            className="text-center font-size-display1 mb-3 font-weight-medium"
            style={{ maxWidth: '32rem' }}
          >
            Limited reservations on upcoming products and restocks.
          </p>
          <Link href="/collection">
            <a className="d-flex py-3 align-items-center font-color-black borderbottom border-color-black">
              <p className="mr-3">See more products</p>
              <img src="/icon/arrow-long-right.svg" />
            </a>
          </Link>
        </div>
        <ProductRow products={products.slice(0, 4)} handleSelectItem={this.handleSelectItem}/>
      </div>
    );
  }
}

ProductsBanner.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
};

ProductsBanner.defaultProps = {
  products: [],
};

export default connect(state => state)(ProductsBanner);
