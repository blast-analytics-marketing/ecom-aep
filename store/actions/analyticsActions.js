import {
  VIRTUAL_PAGE_VIEW,
  TRACK_VIEW_ITEM_LIST,
  TRACK_SELECT_ITEM,
  TRACK_VIEW_ITEM,
  TRACK_ADD_TO_CART,
  TRACK_REMOVE_FROM_CART,
  TRACK_VIEW_CART,
  TRACK_BEGIN_CHECKOUT,
  TRACK_ADD_SHIPPING_INFO,
  TRACK_ADD_PAYMENT_INFO,
  TRACK_PURCHASE,
  TRACK_VIEW_PROMOTION,
  TRACK_SELECT_PROMOTION,
  TRACK_NAVIGATION_CLICK,
  TRACK_LOGIN,
} from './actionTypes';

// Create all Analytics actions to be handled by the middleware, skips reducers

/**
 * Send the virtualPageView, page data
 */
export const virtualPageView = (pageProps) => {
  return {
    type: VIRTUAL_PAGE_VIEW,
    payload: {
      event: "web.webpagedetails.pageViews",
      web: {
        webPageDetails: {
          name: pageProps.page_name,
          siteSection: pageProps.page_category
        }
      },
    },
  }
}

/**
 * Send the view item list, product data
 */
export const viewItemList = (products, list) => {
  const ecomObj =  {
    commerce: {
      productListViews: {
        id: list.id,
        name: list.name,
        value: 1,
      }
    },
    productListItems: []
  };
  ecomObj.productListItems = products.map((
    {
      name,
      id,
      price,
      categories,
      variant_groups,
    },
    index
  ) => {
    const prod =  {
      SKU: id,
      name: name,
      currencyCode: 'USD',
      priceTotal: parseFloat(price.formatted),
      selectedOptions: [
        {
          attribute: `${variant_groups[0]?.name}`,
          value: `${variant_groups[0]?.options[0]?.name}`
        }
      ],
      categories,
    };
    return prod;
  });
  return {
    type: TRACK_VIEW_ITEM_LIST,
    payload: {
      event: "commerce.productListViews",
      ...ecomObj,
    },
  }
}

/** 
 * A thunk for product impressions so that firing the action returns a promise.
 * We use this to sequence a state update in the collections component.
 */
export const trackViewItemList = (products, list) => (dispatch) => {
  dispatch(viewItemList(products, list));
  return Promise.resolve();
};


/**
 * Send the select item, product data
 */
export const trackSelectItem = (products, position, list) => {
  const ecomObj =  {
    items: []
  };
  ecomObj.productListItems = products.map((
    {
      name,
      id,
      price,
      categories,
      variant_groups,
    }
  ) => {
    const prod =  {
      item_id: id,
      item_name: name,
      currency: 'USD',
      index: position,
      item_brand: "Blast",
      price: parseFloat(price.formatted),
      item_variant: `${variant_groups[0]?.name}: ${variant_groups[0]?.options[0]?.name}`,
      item_list_id: list.id,
      item_list_name: list.name,
    };
    categories.forEach((cat, i) => prod[i > 0 ? `item_category${i+1}` : 'item_category'] = cat.name);
    return prod;
  });
  return {
    type: TRACK_SELECT_ITEM,
    payload: {
      event: "select_item",
      ecommerce: ecomObj,
    },
  }
}

/**
 * Send the view item, product data
 */
export const trackViewItem = (product) => {
  const { name, id, price, categories, variant_groups } = product;
  const ecomObj =  {
    commerce: {
      productViews: {
        id: id,
        name: name,
        value: 1,
      }
    },
    productListItems: []
  };
  const prod =  {
    SKU: id,
    name: name,
    currencyCode: 'USD',
    priceTotal: parseFloat(price.formatted),
    selectedOptions: [
      {
        attribute: `${variant_groups[0]?.name}`,
        value: `${variant_groups[0]?.options[0]?.name}`
      }
    ],
    categories,
  };
  ecomObj.productListItems.push(prod);
  return {
    type: TRACK_VIEW_ITEM,
    payload: {
      event: "commerce.productViews",
      ...ecomObj,
    },
  }
}

/**
 * Send the addToCart, product data
 */
export const trackAddToCart = (product, quantity, selected_options) => {
  const { name, id, price, categories, variant_groups } = product;
  const createVariantFromGroups = (selectedOption) => {
    const variantId = Object.keys(selectedOption)[0];
    const variant_option_id = selectedOption[Object.keys(selectedOption)[0]];
    const variant = variant_groups.find(variant => variant.id === variantId);
    const variant_name = variant?.name;
    const variant_option = variant?.options.find(option => option.id === variant_option_id);
    const variant_option_name = variant_option?.name;
    return `${variant_name}: ${variant_option_name}`
  }
  let variant = '';
  if(selected_options[0]?.group_name) {
    variant = selected_options.map(({group_name, option_name}) => `${group_name}: ${option_name}`).sort().join();
  } else {
    variant = createVariantFromGroups(selected_options);
  }
  const ecomObj =  {
    commerce: {
      productListAdds: {
        id: id,
        name: name,
        value: 1,
      }
    },
    productListItems: []
  };
  const prod =  {
    SKU: id,
    name: name,
    currencyCode: 'USD',
    priceTotal: parseFloat(price.formatted),
    quantity: quantity,
    categories,
  };
  ecomObj.productListItems.push(prod);
  return {
    type: TRACK_ADD_TO_CART,
    payload: {
      event: "commerce.productListAdds",
      ...ecomObj,
    },
  }
}

/**
 * Send the removeFromCart, product data
 */
export const trackRemoveFromCart = (product, quantity, selected_options) => {
  const { name, id, price, categories } = product;
  const ecomObj =  {
    commerce: {
      productListRemovals: {
        id: id,
        name: name,
        value: 1,
      }
    },
    productListItems: []
  };
  const prod =  {
    SKU: id,
    name: name,
    currencyCode: 'USD',
    priceTotal: parseFloat(price.formatted),
    quantity: quantity,
    categories,
  };
  ecomObj.productListItems.push(prod);
  return {
    type: TRACK_REMOVE_FROM_CART,
    payload: {
      event: "commerce.productListRemovals",
      ...ecomObj,
    },
  }
}

/**
 * Send the view cart, product data
 */
export const trackViewCart = (products, cart_id) => {
  const ecomObj =  {
    cart_id,
    items: []
  };
  ecomObj.items = products.map((
    {
      name,
      id,
      price,
      quantity,
      categories,
      selected_options,
    }
  ) => {
    const prod =  {
      item_id: id,
      item_name: name,
      currency: 'USD',
      item_brand: "Blast",
      price: parseFloat(price.formatted),
      item_variant: selected_options.map(({group_name, option_name}) => `${group_name}: ${option_name}`).sort().join(),
      quantity
    };
    categories.forEach((cat, i) => prod[i > 0 ? `item_category${i+1}` : 'item_category'] = cat.name);
    return prod;
  });
  return {
    type: TRACK_VIEW_CART,
    payload: {
      event: "view_cart",
      ecommerce: ecomObj,
    },
  }
}

/**
 * Send the begin checkout, product data
 */
export const trackBeginCheckout = (products, cart_id) => {
  const ecomObj =  {
    commerce: {
      checkouts: {
        id: cart_id,
        name: "Begin Checkout",
        value: 1,
      }
    },
    productListItems: []
  };
  ecomObj.productListItems = products.map((
    {
      name,
      id,
      price,
      quantity,
      categories,
      variant_groups,
    }
  ) => {
    const prod =  {
      SKU: id,
      name: name,
      currencyCode: 'USD',
      priceTotal: parseFloat(price.formatted),
      quantity: quantity,
      selectedOptions: [
        {
          attribute: `${variant_groups[0]?.name}`,
          value: `${variant_groups[0]?.options[0]?.name}`
        }
      ],
      categories,
    };
    return prod;
  });
  return {
    type: TRACK_BEGIN_CHECKOUT,
    payload: {
      event: "commerce.checkouts",
      ...ecomObj,
    },
  }
}

/**
 * Send the add shipping info, product data
 */
export const trackAddShippingInfo = (products, cart_id, shipping_tier) => {
  const { description, price } = shipping_tier;
  const ecomObj =  {
    commerce: {
      checkouts: {
        id: cart_id,
        name: "Add Shipping Info",
        value: 1,
        shipping_tier: `${description} - ${price.formatted_with_code}`,
      }
    },
    productListItems: []
  };
  ecomObj.productListItems = products.map((
    {
      name,
      id,
      price,
      quantity,
      categories,
      variant_groups,
    }
  ) => {
    const prod =  {
      SKU: id,
      name: name,
      currencyCode: 'USD',
      priceTotal: parseFloat(price.formatted),
      quantity: quantity,
      selectedOptions: [
        {
          attribute: `${variant_groups[0]?.name}`,
          value: `${variant_groups[0]?.options[0]?.name}`
        }
      ],
      categories,
    };
    return prod;
  });
  return {
    type: TRACK_ADD_SHIPPING_INFO,
    payload: {
      event: "commerce.checkouts",
      ...ecomObj,
    },
  }
}

/**
 * Send the add payment info, product data
 */
export const trackAddPaymentInfo = (products, cart_id) => {
  const ecomObj =  {
    commerce: {
      checkouts: {
        id: cart_id,
        name: "Add Payment Info",
        value: 1,
      }
    },
    productListItems: []
  };
  ecomObj.productListItems = products.map((
    {
      name,
      id,
      price,
      quantity,
      categories,
      variant_groups,
    }
  ) => {
    const prod =  {
      SKU: id,
      name: name,
      currencyCode: 'USD',
      priceTotal: parseFloat(price.formatted),
      quantity: quantity,
      selectedOptions: [
        {
          attribute: `${variant_groups[0]?.name}`,
          value: `${variant_groups[0]?.options[0]?.name}`
        }
      ],
      categories,
    };
    return prod;
  });
  return {
    type: TRACK_ADD_PAYMENT_INFO,
    payload: {
      event: "commerce.checkouts",
      ...ecomObj,
    },
  }
}

/**
 * Send the purchase, product data
 */
export const trackPurchase = (products, orderReceipt) => {
  console.log('orderReceipt', orderReceipt);
  const ecomObj = {
    commerce: {
      purchases: {
        id: orderReceipt.id,
        value: 1,
      },
      order: {
        payments: orderReceipt.transactions.map(trans => {
          return {
            currencyCode: 'USD',
            paymentAmount: parseFloat(trans.amount.formatted),
            paymentType: trans.payment_source_type,
            transactionID: trans.id
          }
        }),
        currencyCode: 'USD',
        priceTotal: parseFloat(orderReceipt.order_value.formatted),
        purchaseID: orderReceipt.id,
      }
    }
  }
  ecomObj.productListItems = products.map((
    {
      name,
      id,
      price,
      quantity,
      categories,
      selected_options,
    }
  ) => {
    const prod =  {
      SKU: id,
      name: name,
      currencyCode: 'USD',
      priceTotal: parseFloat(price.formatted),
      quantity: quantity,
      selectedOptions: [
        {
          attribute: `${selected_options[0]?.group_name}`,
          value: `${selected_options[0]?.option_name}`
        }
      ],
      categories,
    };
    return prod;
  });
  return {
    type: TRACK_PURCHASE,
    payload: {
      event: "commerce.purchases",
      ...ecomObj,
    },
  }
}

/**
 * Send the select promotion, promotion data
 */
export const trackSelectPromotion = (promotion_id, promotion_name, creative_name, creative_slot, location_id) => {
  const ecomObj =  {
    items: [{
      promotion_id,
      promotion_name,
      creative_name,
      creative_slot,
      location_id,
    }]
  };
  return {
    type: TRACK_SELECT_PROMOTION,
    payload: {
      event: "select_promotion",
      ecommerce: ecomObj,
    },
  }
}


/**
 * Send the navigation click, page data
 */
export const trackNavigationClick = (link_name) => {
  return {
    type: TRACK_NAVIGATION_CLICK,
    payload: {
      event: "navigation_click",
      link_name
    },
  }
}

/**
 * Send the login, page data
 */
export const trackLogin = () => {
  return {
    type: TRACK_LOGIN,
    payload: {
      event: "login",
    },
  }
}
