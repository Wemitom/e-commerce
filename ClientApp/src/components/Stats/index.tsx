import { Chart } from 'react-google-charts';

import Section from 'components/common/Section';
import { ReactComponent as Spinner } from 'public/spinner.svg';
import { useGetStatsByCategoryQuery, useGetStatsByYearQuery } from 'store/api';

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

  return (
    <div className="flex w-full justify-between gap-3 px-6 [&>div]:grow">
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
  );
};

export default Stats;
