import { useState, useRef, useEffect } from 'react';

export interface SelectOption<T extends string | number> {
    label: string;
    value: T;
}

export interface CustomSelectProps<T extends string | number> {
    value: T;
    options: SelectOption<T>[];
    onChange: (value: T) => void;
    className?: string;
    prefix?: React.ReactNode;
    disabled?: boolean;
}

export function CustomSelect<T extends string | number>({
    value,
    options,
    onChange,
    className = '',
    prefix,
    disabled = false,
}: CustomSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((o) => o.value === value) || options[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={`flex w-full min-w-[140px] items-center justify-between gap-2 rounded-lg border border-outline bg-card-surface px-3 py-1.5 text-sm text-on-background transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-50' : 'hover:bg-warm-bg'
                    }`}
            >
                <div className="flex items-center gap-2 truncate">
                    {prefix && <span className="text-text-muted">{prefix}</span>}
                    <span className="truncate">{selectedOption?.label}</span>
                </div>
                {/* Chevron Down */}
                <svg
                    className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {isOpen && !disabled && (
                <div className="absolute top-full z-50 mt-1 max-h-60 w-full min-w-max overflow-auto rounded-lg border border-outline bg-card-surface py-1 shadow-lg ring-1 ring-black/5 animate-[fadeIn_150ms_ease-out]">
                    {options.map((option) => (
                        <button
                            key={String(option.value)}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-warm-bg ${option.value === value
                                ? 'bg-primary/5 font-semibold text-primary'
                                : 'text-on-background'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
