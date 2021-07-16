import React from 'react';
import { formatDistance } from 'date-fns';

import MobileDatabaseListEntry from './MobileDatabaseListEntry';
import DesktopDatabaseListEntry from './DesktopDatabaseListEntry';
import { DatabaseProperties } from '../../types/models';


export interface DatabaseListProps {
    databases: ReadonlyArray<DatabaseProperties>;
    onClick?: (id: number) => void;
}


const DatabaseList: React.FC<DatabaseListProps> = ({ databases, onClick }) => {
    return (
        <>
            {/*Mobile*/}
            <div className="shadow sm:hidden">
                <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
                    {databases.map((database, index) => (
                        <MobileDatabaseListEntry key={index} database={database} onClick={onClick} />
                    ))}
                </ul>
            </div>
            {/*Desktop*/}
            <div className="hidden sm:block">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col mt-2">
                        <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Engine
                                        </th>
                                        <th className="hidden px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider md:block">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {databases.map((database, index) => (
                                        <DesktopDatabaseListEntry key={index} database={database} onClick={onClick} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export const getDatabaseEngineTitle = (value: string): string => {
    if (value === 'P') {
        return 'PostgreSQL';
    } else if (value === 'M') {
        return 'MongoDB';
    } else {
        return 'Unknown';
    }
}

export const getDatabaseCreatedAt = (value: Date): string => {
    return formatDistance(value, new Date(), { addSuffix: true })
}

export default DatabaseList;
