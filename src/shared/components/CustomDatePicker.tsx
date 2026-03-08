import { useState, useRef, useEffect } from 'react';

export interface CustomDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    className?: string;
    label?: string;
}

export function CustomDatePicker({ value, onChange, className = '', label }: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse the current date or use today
    const date = value ? new Date(value) : new Date();
    const [viewDate, setViewDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1));

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Format to YYYY-MM-DD
        const formatted = selected.toISOString().split('T')[0];
        onChange(formatted);
        setIsOpen(false);
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const offset = firstDayOfMonth(year, month);

    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    const blanks = Array.from({ length: offset }, (_, i) => i);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {label && <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-text-muted">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full min-w-[140px] items-center justify-between gap-2 rounded-lg border border-outline bg-card-surface px-3 py-1.5 text-sm text-on-background transition-colors hover:bg-warm-bg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{value || 'Select Date'}</span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 z-50 mt-1 w-64 rounded-lg border border-outline bg-card-surface p-3 shadow-lg ring-1 ring-black/5 animate-[fadeIn_150ms_ease-out]">
                    <div className="mb-3 flex items-center justify-between">
                        <button type="button" onClick={handlePrevMonth} className="rounded-md p-1 hover:bg-warm-bg">
                            <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-bold text-on-background">
                            {monthNames[month]} {year}
                        </span>
                        <button type="button" onClick={handleNextMonth} className="rounded-md p-1 hover:bg-warm-bg">
                            <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                            <div key={d} className="py-1 text-[10px] font-bold uppercase text-text-muted">
                                {d}
                            </div>
                        ))}
                        {blanks.map((b) => (
                            <div key={`blank-${b}`} className="py-1" />
                        ))}
                        {days.map((d) => {
                            const isSelected = value === new Date(year, month, d).toISOString().split('T')[0];
                            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

                            return (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => handleDateClick(d)}
                                    className={`rounded-md py-1 text-xs transition-colors hover:bg-primary/10 ${isSelected ? 'bg-primary text-white font-bold' :
                                            isToday ? 'bg-primary/5 text-primary font-bold' : 'text-on-background'
                                        }`}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
