import React from 'react'


export interface EngineOption {
    id: number;
    value: string;
    label: string;
    imageSrc: string;
    alt: string;
}

export interface EngineSelectorProps {
    engineOptions: ReadonlyArray<EngineOption>;
    selectedValue: string;
    error?: string;
    onSelect: (value: string) => void;
}

const EngineSelector: React.FC<EngineSelectorProps> = ({ engineOptions, selectedValue, error, onSelect }) => {

    const getClassName = (value: string) => {
        const result = ["cursor-pointer"];
        if (selectedValue === value) {
            result.push("text-blue-500 bg-blue shadow divide-y divide-blue-500 border rounded-sm border-blue-500 hover:bg-blue-100");
        } else {
            result.push("bg-white shadow divide-y divide-gray-200 rounded-sm hover:bg-gray-100");
        }
        return result.join(" ")
    }

    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-row space-x-4">
                {engineOptions.map((engineOption, index) => (
                    <div key={index} className={getClassName(engineOption.value)} onClick={() => onSelect(engineOption.value)}>
                        <div className="px-4 py-5 sm:p-6 ">
                            <img className="w-36 h-16" src={engineOption.imageSrc} alt="postgresql logo" />
                        </div>
                        <div className="px-4 py-4 sm:px-6 text-center">
                            {engineOption.label}
                        </div>
                    </div>
                ))}
            </div>
            {error && <div className="mt-2 text-sm text-red-600" id="nameHelp">{error}</div>}
        </div>
    )
}

export default EngineSelector;