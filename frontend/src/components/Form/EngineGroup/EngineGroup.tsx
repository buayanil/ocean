import React from 'react'

import { EngineOption, IEngineOption } from './EngineOption';


export interface EngineSelectorProps {
    /**
     * List of engines options.
     */
    engineOptions: ReadonlyArray<IEngineOption>;
    /**
     * The selected engine options.
     */
    selectedValue: string;
    /**
     * The function called when the engine option state changes.
     */
    onSelect?: (value: string) => void;
}

export const EngineGroup: React.FC<EngineSelectorProps> = ({ engineOptions, selectedValue, onSelect }) => {
    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-row space-x-4">
                {engineOptions.map((engineOption, index) => (
                    <EngineOption key={index.toString()}
                        engineOption={engineOption}
                        selected={engineOption.value === selectedValue}
                        onSelect={onSelect} />
                ))}
            </div>
        </div>
    )
}
