import React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export function Switch({ className, checked, defaultChecked, ...props }: SwitchProps) {
    return (
        <label className={`relative inline-flex items-center cursor-pointer ${className || ''}`}>
            <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked={defaultChecked}
                checked={checked}
                {...props}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    );
}
