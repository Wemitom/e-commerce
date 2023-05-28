import { classNames } from 'utils';

const Button = ({
  children,
  handleClick,
  submit
}: {
  children: string;
  handleClick: () => void;
  submit?: boolean;
}) => {
  return (
    <button
      className={classNames(
        'h-12 w-11/12 rounded-md transition-colors duration-200 bg-accent text-white cursor-pointer hover:bg-accent/90'
      )}
      onClick={handleClick}
      type={submit ? 'submit' : undefined}
    >
      {children}
    </button>
  );
};

export default Button;
