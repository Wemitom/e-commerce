import { Fragment } from 'react';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { useGetCategoriesQuery } from 'store/api';

export default function Dropdown() {
  const { data: categories } = useGetCategoriesQuery();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="bg-accent hover:bg-accent/90 flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-md px-3 text-white transition-colors duration-200">
          Категории
          <ChevronDownIcon
            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-40 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <span
                  className={`${
                    active ? 'text-accent !bg-white' : 'text-white-900'
                  } bg-accent group relative z-20 flex w-full items-center rounded-md p-2 text-sm text-white`}
                >
                  Добавить новую
                </span>
              )}
            </Menu.Item>
          </div>
          {categories ? (
            categories.map((option) => (
              <div key={option} className="p-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <span
                      className={`${
                        active ? 'bg-accent/80 text-white' : 'text-gray-900'
                      } group relative z-20 flex w-full items-center rounded-md p-2 text-sm`}
                    >
                      {option}
                      <button
                        className="[&>div]:hover:bg-accent/80 top-0 w-full"
                        // onClick={() => handleDelete(option)}
                      >
                        <div className="absolute right-0 h-[2px] w-4 rotate-45 bg-black transition-colors duration-300" />
                        <div className="absolute right-0 h-[2px] w-4 -rotate-45 bg-black transition-colors duration-300" />
                      </button>
                    </span>
                  )}
                </Menu.Item>
              </div>
            ))
          ) : (
            <div className="p-1 ">
              <Menu.Item>
                {({ active }) => (
                  <span
                    className={`${
                      active ? 'bg-accent/80 text-white' : 'text-gray-900'
                    } group relative z-20 flex w-full items-center rounded-md p-2 text-sm`}
                  >
                    Загрузка
                  </span>
                )}
              </Menu.Item>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
