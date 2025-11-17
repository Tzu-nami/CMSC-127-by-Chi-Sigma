import { StringToBoolean } from 'class-variance-authority/types';
import React from 'react';
import Select, {StylesConfig} from 'react-select';

interface Option {
    value: string;
    label: string;
}

interface SelectDropdownProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    label?: string;
    className?: string;
    isSearchable?: boolean;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
    id,
    value,
    onChange,
    options,
    placeholder = "Select an option",
    required = false,
    disabled = false,
    error,
    label,
    className = "",
    isSearchable = true,
}) => {

    // Find selected object
    const selectedOption = options.find(option => option.value === value) || null;

    const customStyles: StylesConfig<Option, false> = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '40px',
            borderColor: error
            ? '#ef4444'
            :  state.isFocused
                ? '#3b82f6'
                : '#d1d5db',
            borderRadius: '0.375rem',
            boxShadow: error
            ?  '0 0 0 2px rgba(239, 68, 68, 0.5)'
            : state.isFocused
                ? '0 0 0 2px rgba(59, 130, 246, 0.5)'
                : 'none',
            '&:hover': {
                borderColor: error ? '#ef4444' : '#9ca3af',
            },
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: disabled ? '#f9fafb' : '#ffffff',
            opacity: disabled ? 0.5  : 1,
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '2px 12px',
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
            padding: '0px',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6b7280',
        }),
        menu: (provided) => ({
            ...provided,
            zIndex:  9999,
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }),
        option: (provided, state) => ({
            ...provided,
            zIndex: 9999,
            borderRadius: '0.375rem',
            backgroundColor: state.isSelected
            ? '#8C9657'
            : state.isFocused
                ? '#f3f4f6'
                : '#ffffff',
            color: state.isSelected ? '#ffffff' : '#1f2937',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: '#8c9567',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#1f2937',
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none',
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: state.isFocused ?  '#6b7280' : '#9ca3af',
            '&:hover': {
                color: '#6b7280',
            },
        }),
    };

    return (
        <div className={`grid gap-2 ${className}`}>
            {label && (
                label && <label htmlFor={id} className="text-sm font-medium text-foreground">
                    {label} {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <Select
                inputId={id}
                value={selectedOption}
                onChange={(option) => onChange(option?.value || '')}
                options={options}
                placeholder={placeholder}
                isDisabled={disabled}
                isSearchable={isSearchable}
                isClearable={!required}
                styles={customStyles}
                className="select-container"
                classNamePrefix="select"
                noOptionsMessage={() => "No options available"}

                // For serching ID and name
                filterOption={(option, searchText) => {
                    if (!searchText) return true;
                    const search = searchText.toLowerCase();
                    const label = option.label.toLowerCase();
                    return label.includes(search);
                }}
                />

                {/* For errors */}
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
        </div>
    );
};