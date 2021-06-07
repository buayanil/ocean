/* This example requires Tailwind CSS v2.0+ */
import React, { useState } from 'react'


export interface EngineOption {
    id: number;
    label: string;
    imageSrc: string;
    alt: string;
}

export interface EngineSelectorProps {
    engineOptions: ReadonlyArray<EngineOption>;
}

const EngineSelector: React.FC<EngineSelectorProps> = ({engineOptions}) => {
    const [optionId, setOptionId] =  useState<number>(1)

    const getClassName = (value: number) => {
        if (optionId === value) {
            return "text-blue-500 bg-blue overflow-hidden shadow divide-y divide-blue-500 border rounded-sm border-blue-500 hover:bg-blue-100";
        } else {
            return "bg-white overflow-hidden shadow divide-y divide-gray-200 rounded-sm hover:bg-gray-100"
        }
    }

    return (
        <div className="flex flex-row space-x-4">
            {engineOptions.map((engineOption, index) => (
                <div key={index} className={getClassName(engineOption.id)}
                    onClick={() => setOptionId(engineOption.id)}>
                    <div className="px-4 py-5 sm:p-6 ">
                        <img className="w-32 h-16" src={engineOption.imageSrc} alt="postgresql logo" />
                    </div>
                    <div className="px-4 py-4 sm:px-6 text-center">
                        {engineOption.label}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default EngineSelector;