import { useState } from 'react';
import '../main.css';

import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Cart from './Cart';
import Order from './Cart/Order';
import Success from './Cart/Order/Success';
import Header from './Header';
import Products from './Products';
import Stats from './Stats';

function App() {
  const [search, setSearch] = useState('');

  return (
    <>
      <Header setSearch={setSearch} />
      <main className="mt-6 flex flex-col items-center bg-white">
        <Routes>
          <Route path="/">
            <Route index element={<Products search={search} />} />
            <Route path="cart">
              <Route index element={<Cart />} />
              <Route path="order" element={<Order />} />
              <Route path="order/success" element={<Success />} />
            </Route>
            <Route path="stats" element={<Stats />} />
          </Route>
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={50000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
