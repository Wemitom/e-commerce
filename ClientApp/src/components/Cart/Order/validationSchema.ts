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
    .min(2, 'Имя слишком короткое!')
    .max(50, 'Имя слишком длинное!')
    .required('Требуется для заполнения'),
  lastName: Yup.string()
    .min(2, 'Фамилия слишком короткая!')
    .max(50, 'Фамилия слишком длинная!')
    .required('Требуется для заполнения'),
  email: Yup.string()
    .email('Неверный e-mail!')
    .required('Требуется для заполнения'),
  country: Yup.string()
    .not([''], 'Выберите страну!')
    .required('Требуется для заполнения'),
  address: Yup.string()
    .min(2, 'Адрес слишком короткий!')
    .max(100, 'Адрес слишком длинный!')
    .required('Требуется для заполнения'),
  city: Yup.string()
    .min(2, 'Город слишком короткий!')
    .max(50, 'Город слишком длинный!')
    .required('Требуется для заполнения'),
  zip: Yup.string()
    .min(5, 'Индекс слишком короткий!')
    .max(9, 'Индекс слишком длинный!')
    .required('Требуется для заполнения'),
  countryDelivery: Yup.string().when('deliverToBilling', {
    is: (deliverToBilling: boolean) => !deliverToBilling,
    then: Yup.string()
      .not([''], 'Выберите страну')
      .required('Требуется для заполнения')
  }),
  addressDelivery: Yup.string().when('deliverToBilling', {
    is: (deliverToBilling: boolean) => !deliverToBilling,
    then: Yup.string()
      .min(2, 'Адрес слишком короткий!')
      .max(100, 'Адрес слишком длинный!')
      .required('Требуется для заполнения')
  }),
  cityDelivery: Yup.string().when('deliverToBilling', {
    is: (deliverToBilling: boolean) => !deliverToBilling,
    then: Yup.string()
      .min(2, 'Город слишком короткий!')
      .max(50, 'Город слишком длинный!')
      .required('Требуется для заполнения')
  }),
  zipDelivery: Yup.string().when('deliverToBilling', {
    is: (deliverToBilling: boolean) => !deliverToBilling,
    then: Yup.string()
      .min(5, 'Индекс слишком короткий!')
      .max(9, 'Индекс слишком длинный!')
      .required('Требуется для заполнения')
  }),
  cardNum: Yup.string()
    .min(12, 'Слишком короткий номер!')
    .max(19, 'Слишком длинный номер!')
    .test(
      'test-number',
      'Неверный номер!',
      (value) => !!value && isValid(value)
    )
    .required('Требуется для заполнения'),
  cardExp: Yup.string()
    .length(5, 'Введите верный срок действия!')
    .required('Требуется для заполнения')
    .test(
      'test-number',
      'Неверный месяц!',
      (value) =>
        !!value && +value.split('/')[0] <= 12 && +value.split('/')[0] >= 1
    )
    .test(
      'test-number',
      'Неверный год!',
      (value) =>
        !!value &&
        +value.split('/')[1] >=
          +(new Date().getFullYear() + '').split('').slice(2).join('')
    ),
  cardCVC: Yup.string()
    .length(3, 'Введите действительный CVC!')
    .required('Требуется для заполнения'),
  cardFullname: Yup.string()
    .min(2, 'Слишком короткое!')
    .max(50, 'Слишком длинное!')
    .required('Требуется для заполнения')
});
