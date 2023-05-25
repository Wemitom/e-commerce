import React from 'react';

const Section = ({
  title,
  children
}: {
  title: string;
  children: JSX.Element;
}) => {
  return (
    <div className="mb-6 flex h-fit w-10/12 flex-col rounded-md border border-gray-300 bg-slate-100 p-3 md:w-7/12">
      <h2 className="mb-3 text-center text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
};

export default Section;
