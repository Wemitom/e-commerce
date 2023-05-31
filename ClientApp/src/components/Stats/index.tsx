import { Chart } from 'react-google-charts';

import Section from 'components/common/Section';
import { ReactComponent as Spinner } from 'public/spinner.svg';
import { useGetStatsQuery } from 'store/api/statsApi';

const Stats = () => {
  const { data, isLoading } = useGetStatsQuery();

  return (
    <div className="flex w-full justify-between gap-3 px-6 [&>div]:grow">
      <div className="min-w-5/12">
        <Section title="aaaa">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Spinner className="h-12 w-12 animate-spin" />
              Загрузка...
            </div>
          ) : (
            <Chart
              chartType="PieChart"
              data={data}
              width="40vw"
              options={{
                title: 'Сумма проданных товаров по категориям',
                backgroundColor: 'rgb(241,245,249)',
                animation: {
                  duration: 1000,
                  easing: 'linear',
                  startup: true
                }
              }}
            />
          )}
        </Section>
      </div>

      <div className="min-w-5/12">
        <Section title="aaaa">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Spinner className="h-12 w-12 animate-spin" />
              Загрузка...
            </div>
          ) : (
            <Chart
              chartType="PieChart"
              data={data}
              width="40vw"
              options={{
                title: 'Сумма проданных товаров по категориям',
                backgroundColor: 'rgb(241,245,249)',
                animation: {
                  duration: 1000,
                  easing: 'linear',
                  startup: true
                }
              }}
            />
          )}
        </Section>
      </div>
    </div>
  );
};

export default Stats;
