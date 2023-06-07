import { Chart } from 'react-google-charts';

import Section from 'components/common/Section';
import { ReactComponent as Spinner } from 'public/spinner.svg';
import {
  useGetItemStatsByCategoryQuery,
  useGetStatsByCategoryQuery,
  useGetStatsByYearQuery
} from 'store/api';
import { classNames } from 'utils';

const Stats = () => {
  const {
    data: dataByCategory,
    isLoading: isLoadingByCategory,
    isError: isErrorByCategory
  } = useGetStatsByCategoryQuery();
  const {
    data: dataByYear,
    isLoading: isLoadingByYear,
    isError: isErrorByYear
  } = useGetStatsByYearQuery();
  const {
    data: dataItemsByCategory,
    isLoading: isLoadingItemsByCategory,
    isError: isErrorItemsByCategory
  } = useGetItemStatsByCategoryQuery();

  return (
    <div className="w-full px-6">
      <div className="flex w-full justify-between gap-3 [&>div]:grow">
        <div className="min-w-5/12">
          <Section title="Сумма проданных товаров по категориям">
            {isLoadingByCategory ? (
              <div className="flex flex-col items-center justify-center">
                <Spinner className="h-12 w-12 animate-spin" />
                Загрузка...
              </div>
            ) : !isErrorByCategory ? (
              <Chart
                chartType="PieChart"
                data={dataByCategory}
                width="40vw"
                options={{
                  backgroundColor: 'rgb(241,245,249)',
                  animation: {
                    duration: 1000,
                    easing: 'linear',
                    startup: true
                  }
                }}
              />
            ) : (
              <p className="text-center font-bold text-red-600">
                При загрузке возникла ошибка
              </p>
            )}
          </Section>
        </div>

        <div className="min-w-5/12">
          <Section title="Заказов за год">
            {isLoadingByYear ? (
              <div className="flex flex-col items-center justify-center">
                <Spinner className="h-12 w-12 animate-spin" />
                Загрузка...
              </div>
            ) : !isErrorByYear ? (
              <Chart
                chartType="Bar"
                data={dataByYear}
                options={{
                  animation: {
                    duration: 1000,
                    easing: 'linear',
                    startup: true
                  }
                }}
              />
            ) : (
              <p className="text-center font-bold text-red-600">
                При загрузке возникла ошибка
              </p>
            )}
          </Section>
        </div>
      </div>

      <Section title="Кол-во товаров по категориям">
        {isLoadingItemsByCategory ? (
          <div className="flex flex-col items-center justify-center">
            <Spinner className="h-12 w-12 animate-spin" />
            Загрузка...
          </div>
        ) : !isErrorItemsByCategory ? (
          <Chart
            chartType="Bar"
            data={dataItemsByCategory}
            options={{
              animation: {
                duration: 1000,
                easing: 'linear',
                startup: true
              }
            }}
          />
        ) : (
          <p className="text-center font-bold text-red-600">
            При загрузке возникла ошибка
          </p>
        )}
      </Section>

      <Section title="Табличное представление кол-ва товаров по категориям">
        {isLoadingItemsByCategory ? (
          <div className="flex flex-col items-center justify-center">
            <Spinner className="h-12 w-12 animate-spin" />
            Загрузка...
          </div>
        ) : !isErrorItemsByCategory ? (
          <table>
            {dataItemsByCategory!.map((stat, i) => {
              if (!i)
                return (
                  <tr className="border">
                    <th>{stat[0]}</th>
                    <th>{stat[1]}</th>
                  </tr>
                );
              else
                return (
                  <tr
                    className={classNames(
                      'border text-center',
                      i % 2 === 0
                        ? 'bg-white hover:bg-gray-200'
                        : 'bg-gray-300 hover:bg-gray-200'
                    )}
                  >
                    <td>{stat[0]}</td>
                    <td>{stat[1]}</td>
                  </tr>
                );
            })}
          </table>
        ) : (
          <p className="text-center font-bold text-red-600">
            При загрузке возникла ошибка
          </p>
        )}
      </Section>
    </div>
  );
};

export default Stats;
