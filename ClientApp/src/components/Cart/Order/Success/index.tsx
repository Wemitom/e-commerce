import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 flex flex-col items-center gap-12">
      <div className="flex flex-row gap-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-900 bg-green-500">
          ✓
        </div>
        <h2 className="text-2xl font-bold">Thanks for your order!</h2>
      </div>
      <button
        className="h-12 w-11/12 cursor-pointer rounded-md bg-accent text-white transition-colors duration-200 hover:bg-accent/90"
        onClick={() => navigate('/')}
      >
        Return
      </button>
    </div>
  );
};

export default Success;
