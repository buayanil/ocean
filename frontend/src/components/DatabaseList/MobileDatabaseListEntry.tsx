import React from 'react';
import { DatabaseIcon, ChevronRightIcon } from '@heroicons/react/outline';

import { DatabaseProperties } from '../../types/models';
import { getDatabaseCreatedAt, getDatabaseEngineTitle } from './DatabaseList';

interface MobileDatabaseListEntryProps {
    database: DatabaseProperties;
    onClick?: (id: number) => void;
}


const MobileDatabaseListEntry: React.FC<MobileDatabaseListEntryProps> = ({ database, onClick }) => {
    return (
        <li key={database.id} onClick={() => onClick && onClick(database.id)}>
            <div className="block px-4 py-4 bg-white hover:bg-gray-50">
                <span className="flex items-center space-x-4">
                    <span className="flex-1 flex space-x-2 truncate">
                        <DatabaseIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="flex flex-col text-gray-500 text-sm truncate">
                            <span className="truncate">{database.name}</span>
                            <time dateTime={database.createdAt}>{getDatabaseCreatedAt(database.createdAt)}</time>
                            <span>{getDatabaseEngineTitle(database.engine)}</span>
                        </span>
                    </span>
                    <ChevronRightIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
            </div>
        </li>
    );
}

export default MobileDatabaseListEntry;
