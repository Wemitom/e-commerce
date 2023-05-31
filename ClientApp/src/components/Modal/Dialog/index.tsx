import Modal from '..';

const Dialog = ({
  open,
  setOpen,
  title,
  question,
  handleYes
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  title: string;
  question: string;
  handleYes: () => void;
}) => {
  return (
    <Modal open={open} setOpen={setOpen} title={title} center>
      <div className="flex h-36 flex-col justify-between">
        <p className="mt-6">{question}</p>

        <div className="flex w-full gap-6 [&>button]:grow">
          <button
            className="bg-accent hover:bg-accent/90 rounded-lg p-2 text-white"
            onClick={() => setOpen(false)}
          >
            Нет
          </button>
          <button
            className="bg-accent hover:bg-accent/90 rounded-lg p-2 text-white"
            onClick={() => {
              handleYes();
              setOpen(false);
            }}
          >
            Да
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Dialog;
