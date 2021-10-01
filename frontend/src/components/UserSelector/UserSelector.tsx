import React from 'react'
import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

import { User, UserProperties } from '../../types/user';

export interface UserSelectorProps {
    users: UserProperties[];
    selectedUserIds: number[];
    onSelect?: (value: UserProperties) => void;
}


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const UserSelector: React.FC<UserSelectorProps> = ({ users, selectedUserIds, onSelect }) => {

    const onChange = (value: UserProperties | undefined) => {
        if (value && onSelect) {
            onSelect(value)
        }
    }

    return (
        <Listbox value={undefined} onChange={onChange}>
            <Listbox.Label className="block text-sm font-medium text-gray-700">Select to invite</Listbox.Label>
            <div className="mt-1 relative">
                <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <span className="w-full inline-flex truncate">
                        <span className="truncate"></span>
                        <span className="ml-2 truncate text-gray-500"></span>
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>

                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {users.map((user) => (
                            <Listbox.Option
                                key={user.username}
                                className={({ active }) =>
                                    classNames(
                                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                    )
                                }
                                value={user}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <div className="flex">
                                            <span className={classNames(selectedUserIds.find(id => id === user.id) ? 'font-semibold' : 'font-normal', 'truncate')}>
                                                {User.getDisplayName(user)}
                                            </span>
                                            <span className={classNames(active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate')}>
                                                {user.username}
                                            </span>
                                        </div>

                                        {selectedUserIds.find(id => id === user.id) ? (
                                            <span
                                                className={classNames(
                                                    active ? 'text-white' : 'text-indigo-600',
                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                )}
                                            >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )

}

export default UserSelector;