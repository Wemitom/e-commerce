import { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { classNames } from 'utils';

export default function Modal({
  open,
  setOpen,
  title,
  center,
  children
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  center?: boolean;
  children: JSX.Element;
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div
                    className={classNames(
                      'sm:flex',
                      center ? 'sm:justify-center' : 'sm:items-start'
                    )}
                  >
                    <div className="mt-3 w-full text-left sm:mt-0 sm:ml-4">
                      <Dialog.Title
                        as="h3"
                        className="mb-3 text-3xl font-bold leading-6"
                      >
                        {title}
                      </Dialog.Title>
                      {children}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
