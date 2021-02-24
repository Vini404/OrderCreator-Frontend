import React, { ReactElement } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ModifyOrder } from './pages/modifyOrder/modifyOrder';
import { OrderCreator } from './pages/order/orderCreator';



function Routes(): ReactElement {
  return (
    <BrowserRouter>
      <Route path="/" exact component={OrderCreator} />
      <Route path="/modifyOrder" component={ModifyOrder} />
    </BrowserRouter>
  );
}

export default Routes;