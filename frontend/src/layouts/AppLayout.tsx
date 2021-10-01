import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, MenuAlt1Icon, XIcon } from "@heroicons/react/solid";

import { UserProperties } from "../types/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/session/sessionSlice";
import { navigation, SettingsNavigation } from "../constants/menu.";
import CreateDropdown from "../components/CreateDropdown";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export interface AppLayoutProps {
  children: React.ReactNode;
  selectedNavigation: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  selectedNavigation,
}) => {
  const { loading, user } = useAppSelector((state) => state.data.user);
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
  };

  const getAbbreviationFor = (value: UserProperties | undefined): string => {
    const fallbackValue = ":(";
    if (value && value.firstName.length > 0 && value.lastName.length > 0) {
      return value.firstName[0] + value.lastName[0];
    }
    return fallbackValue;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 lg:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-cyan-700">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <img
                  className="h-8 w-auto"
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Logo_HTW_Berlin.svg"
                  alt="HTW logo"
                />
              </div>
              <nav
                className="mt-5 flex-shrink-0 h-full divide-y divide-cyan-800 overflow-y-auto"
                aria-label="Sidebar"
              >
                <div className="px-2 space-y-1">
                  {navigation
                    .filter((item) => item.section === "primary")
                    .map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          item.name === selectedNavigation
                            ? "bg-cyan-800 text-white"
                            : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                        aria-current={
                          item.name === selectedNavigation ? "page" : undefined
                        }
                      >
                        <item.icon
                          className="mr-4 flex-shrink-0 h-6 w-6 text-cyan-200"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                </div>
                <div className="mt-6 pt-6">
                  <div className="px-2 space-y-1">
                    {navigation
                      .filter((item) => item.section === "secondary")
                      .map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            item.name === selectedNavigation
                              ? "bg-cyan-800 text-white"
                              : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                            "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                          )}
                          aria-current={
                            item.name === selectedNavigation
                              ? "page"
                              : undefined
                          }
                        >
                          <item.icon
                            className="mr-4 h-6 w-6 text-cyan-200"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </nav>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow bg-cyan-700 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img
                className="h-8 w-auto self"
                src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Logo_HTW_Berlin.svg"
                alt="HTW logo"
              />
            </div>
            <nav
              className="mt-5 flex-1 flex flex-col divide-y divide-cyan-800 overflow-y-auto"
              aria-label="Sidebar"
            >
              <div className="px-2 space-y-1">
                {navigation
                  .filter((item) => item.section === "primary")
                  .map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={classNames(
                        item.name === selectedNavigation
                          ? "bg-cyan-800 text-white"
                          : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                        "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"
                      )}
                      aria-current={
                        item.name === selectedNavigation ? "page" : undefined
                      }
                    >
                      <item.icon
                        className="mr-4 flex-shrink-0 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
              </div>
              <div className="mt-6 pt-6">
                <div className="px-2 space-y-1">
                  {navigation
                    .filter((item) => item.section === "secondary")
                    .map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          item.name === selectedNavigation
                            ? "bg-cyan-800 text-white"
                            : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                          "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"
                        )}
                        aria-current={
                          item.name === selectedNavigation ? "page" : undefined
                        }
                      >
                        <item.icon
                          className="mr-4 h-6 w-6 text-cyan-200"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto focus:outline-none">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
          <button
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8 border-b-2 border-gray-100">
            <div className="flex-1 flex"></div>
            <div className="ml-4 flex items-center md:ml-6">
              <CreateDropdown />
              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button
                        disabled={loading}
                        className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50"
                      >
                        {loading ? (
                          <div className="animate-pulse rounded-full h-8 w-8 bg-gray-200" />
                        ) : (
                          <svg className="rounded-full" height="36" width="36">
                            <rect
                              fill="#a0d36a"
                              x="0"
                              y="0"
                              height="36"
                              width="36"
                            ></rect>
                            <text
                              fill="#ffffff"
                              fontSize="15"
                              textAnchor="middle"
                              x="17"
                              y="23"
                            >
                              {getAbbreviationFor(user)}
                            </text>
                          </svg>
                        )}
                        {loading ? (
                          <span className="animate-pulse hidden ml-3 lg:block">
                            <div className="rounded-md w-24 h-8 bg-gray-200" />
                          </span>
                        ) : (
                          <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                            <span className="sr-only">Open user menu for </span>
                            {user && user.firstName}
                          </span>
                        )}
                        <ChevronDownIcon
                          className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={SettingsNavigation.to}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={onLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Logout
                            </div>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>
        <main className="flex-1 pb-8 z-0">
          <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
