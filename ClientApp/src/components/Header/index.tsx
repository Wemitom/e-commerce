import { useState } from 'react';

import { MagnifyingGlassIcon, KeyIcon } from '@heroicons/react/20/solid';
import { HomeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { InputField } from 'components/Cart/Order';
import Modal from 'components/Modal';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from 'store';
import { logIn, logOut } from 'store/authSlice';
import { classNames } from 'utils';

import SearchBar from './SearchBar';

const Header = ({ setSearch }: { setSearch: (value: string) => void }) => {
  const [show, setShow] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [errorData, setErrorData] = useState(false);
  const dispatcher = useDispatch();

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((count, item) => count + item.count, 0)
  );
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 border-b bg-white/90 backdrop-blur">
        <ul className="relative flex flex-row items-center justify-between gap-3 py-6">
          <li
            className="ml-12 flex cursor-pointer flex-col items-center sm:ml-16"
            onClick={() => navigate('/')}
          >
            <HomeIcon className="h-8 w-8" />
            <p className=" hidden sm:block">Домой</p>
          </li>
          {!loggedIn && (
            <li
              className={classNames(
                'ml-3 flex w-10 cursor-pointer flex-col items-center text-center sm:ml-6 relative',
                pathname !== '/' ? 'hidden' : ''
              )}
              onClick={() => navigate('cart')}
            >
              {cartCount !== 0 && (
                <div className="absolute -top-3 -right-3 flex h-5 w-5 justify-center rounded-full bg-red-600 align-middle text-sm text-white">
                  {cartCount}
                </div>
              )}
              <ShoppingCartIcon className="h-8 w-8" />
              <p className="hidden sm:block">Корзина</p>
            </li>
          )}
          <li
            className={classNames(
              'mr-12 cursor-pointer sm:ml-auto sm:mr-16 sm:hidden',
              pathname === '/' ? '' : 'hidden'
            )}
          >
            <MagnifyingGlassIcon
              className={classNames(
                'h-8 w-8 transition-color duration-200',
                show ? 'fill-gray-500' : 'fill-black'
              )}
              onClick={() => setShow(!show)}
            />
          </li>
          <li
            className={classNames(
              'ml-3 flex w-10 cursor-pointer flex-col items-center text-center sm:ml-6 relative',
              pathname !== '/' ? 'hidden' : ''
            )}
            onClick={() =>
              !loggedIn ? setShowLogin(true) : dispatcher(logOut())
            }
          >
            <KeyIcon className="h-8 w-8" />
            <p className="hidden sm:block">{!loggedIn ? 'Войти' : 'Выйти'}</p>
          </li>
          <li
            className={classNames(
              'sm:relative sm:top-auto sm:ml-auto flex justify-center mr-16 w-full sm:w-auto',
              show
                ? 'absolute -bottom-12 sm:bottom-auto bg-slate-200 sm:bg-white sm:h-auto h-12'
                : 'hidden sm:inline',
              pathname === '/' ? '' : 'sm:hidden hidden'
            )}
          >
            <SearchBar setSearch={setSearch} />
          </li>
        </ul>
      </header>

      <Modal open={showLogin} setOpen={setShowLogin} title="Вход" center>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={async (data) => {
            const res = (
              await fetch('/auth', {
                body: JSON.stringify(data),
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            ).status;

            switch (res) {
              case 200:
                setShowLogin(false);
                dispatcher(logIn(data.username));
                break;
              case 500:
                setErrorData(true);
                break;
              default:
                // Обработка неизвестной ошибки
                break;
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className="w-full">
              <div className="flex w-80 flex-col items-center">
                <InputField name="username" label="Логин" fullWidth />
                <InputField name="password" label="Пароль" password fullWidth />

                <button
                  className={classNames(
                    'h-12 w-11/12 rounded-md transition-colors duration-200 bg-accent text-white cursor-pointer hover:bg-accent/90 mt-6'
                  )}
                  type="submit"
                >
                  Войти
                </button>
                {errors && touched && (
                  <p className="text-red-500">Введены неверные данные</p>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default Header;
