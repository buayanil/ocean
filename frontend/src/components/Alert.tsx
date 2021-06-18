/* This example requires Tailwind CSS v2.0+ */
import React from 'react'
import { XCircleIcon } from '@heroicons/react/solid';

export interface AlertProps {
    errorMessage? : string;
}

const Alert: React.FC<AlertProps> = ({ errorMessage }) => {
    if (errorMessage !== undefined) {
        return (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Oops, Something Went Wrong :(</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                        {errorMessage}
                    </p>
                </div>
                </div>
              </div>
            </div>
          )
    } else {
        return null;
    }
}

export default Alert;