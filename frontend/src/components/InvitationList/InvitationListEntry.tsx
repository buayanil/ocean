import React from 'react';

import { InvitedUserProperties, User } from '../../types/user';



export interface InvitationListEntryProps {
    user: InvitedUserProperties;
    onDelete: (user: InvitedUserProperties) => void;
}


const InvitationListEntry: React.FC<InvitationListEntryProps> = ({ user, onDelete }) => {

    return (
        <tr >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 ">{User.getDisplayName({...user, mail: "", employeeType: ""})}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="text-red-600 hover:text-red-900 cursor-pointer" onClick={() => onDelete(user)}>
                    Delete
                </div>
            </td>
        </tr>
    );
}

export default InvitationListEntry;
