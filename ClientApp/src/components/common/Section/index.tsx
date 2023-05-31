const Section = ({
  title,
  children
}: {
  title: string;
  children: JSX.Element;
}) => {
  return (
    <div className="mb-6 flex h-fit flex-col rounded-md border border-gray-300 bg-slate-100 p-3">
      <h2 className="mb-3 text-center text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
};

export default Section;
