import { useEffect, useState } from 'react';

import { Formik, Field, Form } from 'formik';
import InputMask from 'react-input-mask';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { CartItemType, changeCount } from 'store/cartSlice';
import { classNames } from 'utils';

import { OrderSchema } from './validationSchema';

const InputField = ({
  name,
  required = false,
  error,
  label,
  fullWidth = false
}: {
  name: string;
  required?: boolean;
  error?: string;
  label?: string;
  fullWidth?: boolean;
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

const AsyncSelect = ({
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
      <label htmlFor={name} className={'ml-1 mb-2'}>
        {label}
      </label>
      <Field
        as="select"
        name={name}
        className={classNames(
          'rounded-xl px-3 py-1 border',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      >
        <option>Select an option</option>
        {loading ? (
          <option>Loading...</option>
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
        label="Country"
        loading={loading}
        options={countries}
      />
      <InputField
        name={addressName}
        error={errorAddress ? errorAddress : undefined}
        label="Address"
        fullWidth
      />
      <div className="flex w-full flex-col justify-between gap-6 sm:flex-row">
        <InputField
          name={cityName}
          error={errorCity ? errorCity : undefined}
          label="City"
        />
        <InputField
          name={zipName}
          error={errorZip ? errorZip : undefined}
          label="Zip code"
        />
      </div>
    </div>
  );
};

const Order = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      onSubmit={() => {
        state.orderedItems.forEach((item: CartItemType) =>
          dispatch(changeCount({ id: item.item.id, count: 0 }))
        );
        navigate('success');
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
              label="First name"
              required
            />
            <InputField
              name="lastName"
              error={
                errors.lastName && touched.lastName
                  ? errors.lastName
                  : undefined
              }
              label="Last name"
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
            name="Billing address"
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
              Deliver order to the billing address?
            </label>
          </div>

          {!values.deliverToBilling && (
            <InputAddress
              name="Delivery address"
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
              Credit card information<span className="text-red-600">*</span>
            </h2>

            <InputField
              name="cardNum"
              label="Card number"
              error={
                errors.cardNum && touched.cardNum ? errors.cardNum : undefined
              }
            />
            <div className="mb-3 flex w-full flex-col justify-between gap-6 sm:flex-row">
              <div className="mb-1 flex flex-col">
                <label htmlFor="cardNum" className="ml-1 mb-2">
                  Card expiration date
                </label>
                <InputMask
                  mask="99/99"
                  value={values.cardExp}
                  onChange={handleChange}
                >
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                  {/* @ts-ignore*/}
                  {() => (
                    <Field
                      name="cardExp"
                      className={classNames(
                        'rounded-xl px-3 py-1 border',
                        errors.cardExp && touched.cardExp
                          ? 'border-red-500'
                          : 'border-gray-300'
                      )}
                    />
                  )}
                </InputMask>
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
                label="Card CVC"
              />
            </div>
            <InputField
              name="cardFullname"
              error={
                errors.cardFullname && touched.cardFullname
                  ? errors.cardFullname
                  : undefined
              }
              label="Cardholder"
            />
          </div>

          <div className="mb-6 flex h-fit w-full flex-col rounded-md bg-slate-100">
            <div className="mb-6 flex justify-center border-b p-6">
              <button
                className={classNames(
                  'h-12 w-11/12 rounded-md transition-colors duration-200 bg-accent text-white cursor-pointer hover:bg-accent/90'
                )}
                type="submit"
              >
                Order
              </button>
            </div>
            <div className="mb-6 p-3">
              <h3 className="mb-3 text-xl font-bold">Total cost</h3>
              <p className="flex justify-between">
                <span>
                  Items (
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
                  $
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
