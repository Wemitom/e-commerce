import { useNavigate } from 'react-router-dom';

import Button from 'components/common/Button';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 flex flex-col items-center gap-12">
      <div className="flex flex-row gap-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-900 bg-green-500">
          ✓
        </div>
        <h2 className="text-2xl font-bold">Спасибо за заказ!</h2>
      </div>
      <Button handleClick={() => navigate('/')}>Вернуться</Button>
    </div>
  );
};

export default Success;
