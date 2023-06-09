import { useEffect, useState } from 'react';

import { Formik, Field, Form } from 'formik';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import MaskedInput from 'react-text-mask';

import Button from 'components/common/Button';
import { useOrderMutation } from 'store/api';
import { CartItemType, changeCount } from 'store/cartSlice';
import { classNames } from 'utils';

import { OrderSchema } from './validationSchema';

export const InputField = ({
  name,
  required = false,
  error,
  label,
  fullWidth = false,
  password = false
}: {
  name: string;
  required?: boolean;
  error?: string;
  label?: string;
  fullWidth?: boolean;
  password?: boolean;
}) => {
  return (
    <div
      className={classNames('flex flex-col mb-1', fullWidth ? 'w-full' : '')}
    >
      <label
        htmlFor={name}
        className={classNames('ml-1 mb-1', required ? 'font-bold' : '')}
      >
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <Field
        type={password ? 'password' : undefined}
        name={name}
        className={classNames(
          'rounded-xl px-3 py-1 border',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {<p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const AsyncSelect = ({
  name,
  label,
  error,
  loading,
  options
}: {
  name: string;
  label: string;
  error?: string;
  loading: boolean;
  options: string[];
}) => {
  return (
    <div className="flex w-full flex-col">
      <label htmlFor={name} className="ml-1 mb-2 font-bold">
        {label}
        <span className="text-red-600">*</span>
      </label>
      <Field
        as="select"
        name={name}
        className={classNames(
          'rounded-xl px-3 py-1 border',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      >
        <option value="">Выберите вариант</option>
        {loading ? (
          <option value="">Загрузка...</option>
        ) : (
          options.map((option) => <option key={option}>{option}</option>)
        )}
      </Field>
      {<p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

const InputAddress = ({
  name,
  countryName,
  addressName,
  cityName,
  zipName,
  errorCountry,
  errorAddress,
  errorCity,
  errorZip
}: {
  name: string;
  countryName: string;
  addressName: string;
  cityName: string;
  zipName: string;
  errorCountry?: string;
  errorAddress?: string;
  errorCity?: string;
  errorZip?: string;
}) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://restcountries.com/v2/all?fields=name').then((res) =>
      res.json().then((data: [{ name: string }]) => {
        setCountries(data.map((d) => d.name));
        setLoading(false);
      })
    );
  }, []);

  return (
    <div className="flex w-full flex-col gap-6 transition-opacity duration-300">
      <h2 className="font-bold">
        {name} <span className="text-red-600">*</span>
      </h2>
      <AsyncSelect
        name={countryName}
        error={errorCountry ? errorCountry : undefined}
        label="Страна"
        loading={loading}
        options={countries}
      />
      <InputField
        name={addressName}
        error={errorAddress ? errorAddress : undefined}
        label="Адрес"
        fullWidth
      />
      <div className="flex w-full flex-col justify-between gap-6 sm:flex-row">
        <InputField
          name={cityName}
          error={errorCity ? errorCity : undefined}
          label="Город"
        />
        <InputField
          name={zipName}
          error={errorZip ? errorZip : undefined}
          label="Индекс"
        />
      </div>
    </div>
  );
};

export interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  address: string;
  city: string;
  zip: string;
  deliverToBilling: boolean;
  countryDelivery?: string;
  addressDelivery?: string;
  cityDelivery?: string;
  zipDelivery?: string;
  cardNum: string;
  cardExp: string;
  cardCVC: string;
  cardFullname: string;
}

export interface ItemData {
  id: number;
  count: number;
}

const Order = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [order, { isSuccess, isError }] = useOrderMutation();

  useEffect(() => {
    if (isSuccess) {
      state.orderedItems.forEach((item: CartItemType) =>
        dispatch(changeCount({ id: item.item.id, count: 0 }))
      );
      navigate('success');
    }
  }, [dispatch, isSuccess, navigate, state.orderedItems]);

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        address: '',
        city: '',
        zip: '',
        deliverToBilling: true,
        countryDelivery: '',
        addressDelivery: '',
        cityDelivery: '',
        zipDelivery: '',
        cardNum: '',
        cardExp: '',
        cardCVC: '',
        cardFullname: ''
      }}
      validationSchema={OrderSchema}
      onSubmit={(data) => {
        order({
          orderData: data,
          items: state.orderedItems.map((item: CartItemType) => ({
            id: item.item.id,
            count: item.count
          }))
        });
      }}
    >
      {({ errors, touched, values, handleChange }) => (
        <Form className="flex w-8/12 flex-col gap-6 sm:w-6/12 sm:items-start md:w-5/12 lg:w-4/12">
          <div className="flex w-full flex-col justify-between gap-6 sm:flex-row">
            <InputField
              name="firstName"
              error={
                errors.firstName && touched.firstName
                  ? errors.firstName
                  : undefined
              }
              label="Имя"
              required
            />
            <InputField
              name="lastName"
              error={
                errors.lastName && touched.lastName
                  ? errors.lastName
                  : undefined
              }
              label="Фамилия"
              required
            />
          </div>

          <InputField
            name="email"
            error={errors.email && touched.email ? errors.email : undefined}
            label="E-mail"
            required
          />

          <InputAddress
            name="Адрес выставления счета"
            countryName="country"
            addressName="address"
            cityName="city"
            zipName="zip"
            errorCountry={
              errors.country && touched.country ? errors.country : undefined
            }
            errorAddress={
              errors.address && touched.address ? errors.address : undefined
            }
            errorCity={errors.city && touched.city ? errors.city : undefined}
            errorZip={errors.zip && touched.zip ? errors.zip : undefined}
          />

          <div className="flex gap-3">
            <Field type="checkbox" name="deliverToBilling" />
            <label htmlFor="deliverToBilling">
              Доставить заказ по адресу выставления счета
            </label>
          </div>

          {!values.deliverToBilling && (
            <InputAddress
              name="Адрес доставки"
              countryName="countryDelivery"
              addressName="addressDelivery"
              cityName="cityDelivery"
              zipName="zipDelivery"
              errorCountry={
                errors.countryDelivery && touched.countryDelivery
                  ? errors.countryDelivery
                  : undefined
              }
              errorAddress={
                errors.addressDelivery && touched.addressDelivery
                  ? errors.addressDelivery
                  : undefined
              }
              errorCity={
                errors.cityDelivery && touched.cityDelivery
                  ? errors.cityDelivery
                  : undefined
              }
              errorZip={
                errors.zipDelivery && touched.zipDelivery
                  ? errors.zipDelivery
                  : undefined
              }
            />
          )}

          <div className="w-full">
            <h2 className="mb-6 font-bold">
              Информация о карте<span className="text-red-600">*</span>
            </h2>

            <InputField
              name="cardNum"
              label="Номер карты"
              error={
                errors.cardNum && touched.cardNum ? errors.cardNum : undefined
              }
            />
            <div className="mb-3 flex w-full flex-col justify-between gap-6 sm:flex-row">
              <div className="mb-1 flex flex-col">
                <label htmlFor="cardNum" className="ml-1 mb-2">
                  Срок действия карты
                </label>
                <MaskedInput
                  name="cardExp"
                  mask={[/[0-1]/, /[0-9]/, '/', /[0-9]/, /[0-9]/]}
                  className={classNames(
                    'rounded-xl px-3 py-1 border',
                    errors.cardExp && touched.cardExp
                      ? 'border-red-500'
                      : 'border-gray-300'
                  )}
                  value={values.cardExp}
                  onChange={handleChange}
                />
                {
                  <p className="text-sm text-red-600">
                    {errors.cardExp && touched.cardExp
                      ? errors.cardExp
                      : undefined}
                  </p>
                }
              </div>
              <InputField
                name="cardCVC"
                error={
                  errors.cardCVC && touched.cardCVC ? errors.cardCVC : undefined
                }
                label="CVC"
              />
            </div>
            <InputField
              name="cardFullname"
              error={
                errors.cardFullname && touched.cardFullname
                  ? errors.cardFullname
                  : undefined
              }
              label="Имя и фамилия владельца"
            />
          </div>

          <div className="mb-6 flex h-fit w-full flex-col rounded-md bg-slate-100">
            <div className="mb-6 flex flex-col items-center justify-center border-b p-6">
              <Button handleClick={() => console.log('submited')} submit>
                Заказать
              </Button>
              {isError && (
                <p className="text-sm text-red-600">
                  Ошибка при оформлении заказа!
                </p>
              )}
            </div>
            <div className="mb-6 p-3">
              <h3 className="mb-3 text-xl font-bold">Общая стоимость</h3>
              <p className="flex justify-between">
                <span>
                  Товары (
                  {state.orderedItems.reduce(
                    (count: number, cartItem: CartItemType) =>
                      count + cartItem.count,
                    0
                  )}
                  )
                </span>
                <span className="font-bold">
                  {state.orderedItems
                    .reduce(
                      (cost: number, cartItem: CartItemType) =>
                        cost + cartItem.item.price * cartItem.count,
                      0
                    )
                    .toFixed(2)}
                  ₽
                </span>
              </p>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Order;
