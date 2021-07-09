/* This example requires Tailwind CSS v2.0+ */
import React from 'react'


export interface TabProperties {
    id: number;
    name: string;
}

export interface TabListProps {
    tabs: ReadonlyArray<TabProperties>;
    selectedId: number;
    onSelect: (id: number) => void;
}


const TabList: React.FC<TabListProps> = ({ tabs, selectedId, onSelect }) => {

    const classNames = (...classes: string[]): string => {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={classNames(
                            tab.id === selectedId
                                ? 'border-cyan-500 text-cyan-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        )}
                        aria-current={tab.id === selectedId ? 'page' : undefined}
                        onClick={() => onSelect(tab.id)}
                    >
                        {tab.name}
                    </div>
                ))}
            </nav>
        </div>
    )
}

export default TabList;