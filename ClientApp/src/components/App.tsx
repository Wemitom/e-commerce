import { useState } from 'react';
import '../main.css';

import { Route, Routes } from 'react-router-dom';

import Cart from './Cart';
import Order from './Cart/Order';
import Success from './Cart/Order/Success';
import Header from './Header';
import Products from './Products';

function App() {
  const [search, setSearch] = useState('');

  return (
    <>
      <Header setSearch={setSearch} />
      <main className="mt-6 flex justify-center bg-white">
        <Routes>
          <Route path="/">
            <Route index element={<Products search={search} />} />
            <Route path="cart">
              <Route index element={<Cart />} />
              <Route path="order" element={<Order />} />
              <Route path="order/success" element={<Success />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
