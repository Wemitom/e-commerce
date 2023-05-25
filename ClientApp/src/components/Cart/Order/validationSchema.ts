import * as Yup from 'yup';

const isValid = (cardNumber: string): boolean => {
  const arr = cardNumber
    .replaceAll(' ', '')
    .split('')
    .reverse()
    .map((x) => +x);
  const lastDigit = arr.splice(0, 1)[0];
  let sum = arr.reduce(
    (acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9),
    0
  );
  sum += lastDigit;
  return sum % 10 === 0;
};

export const OrderSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  country: Yup.string()
    .not(['Select an option'], 'Select a country')
    .required('Required'),
  address: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  city: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  zip: Yup.string()
    .min(5, 'Too Short!')
    .max(9, 'Too Long!')
    .required('Required'),
  countryDelivery: Yup.string().when('deliverToBilling', {
    is: (deliverToBilling: boolean) => !deliverToBilling,
    then: Yup.string()
      .not(['Select an option'], 'Select a country')
      .required('Required')
  }),
  addressDelivery: Yup.string().when('deliverToBilling', {
    is: (deliverToBilling: boolean) => !deliverToBilling,
    then: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!')
      .required('Required')
  }),
  cityDelivery: Yup.string().when('deliverToBilling', {
    is: (deliverToBilling: boolean) => !deliverToBilling,
    then: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required')
  }),
  zipDelivery: Yup.string().when('deliverToBilling', {
    is: (deliverToBilling: boolean) => !deliverToBilling,
    then: Yup.string()
      .min(5, 'Too Short!')
      .max(9, 'Too Long!')
      .required('Required')
  }),
  cardNum: Yup.string()
    .min(12, 'Credit card number is too short!')
    .max(19, 'Credit card number is too long!')
    .test(
      'test-number',
      'Credit card number is invalid!',
      (value) => !!value && isValid(value)
    )
    .required('Required'),
  cardExp: Yup.string()
    .length(5, 'Enter valid expiry date!')
    .required('Required')
    .test(
      'test-number',
      'Expiry month is invalid!',
      (value) =>
        !!value && +value.split('/')[0] <= 12 && +value.split('/')[0] >= 1
    )
    .test(
      'test-number',
      'Expiry year is invalid!',
      (value) =>
        !!value &&
        +value.split('/')[1] >=
          +(new Date().getFullYear() + '').split('').slice(2).join('')
    ),
  cardCVC: Yup.string().length(3, 'Enter valid CVC!').required('Required'),
  cardFullname: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required')
});
