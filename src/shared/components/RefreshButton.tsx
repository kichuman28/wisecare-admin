import { RefreshIcon } from './Icons';

interface RefreshButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    className?: string;
}

/**
 * A compact, subtle button with a refresh icon.
 * Spins when `isLoading` is true.
 */
export function RefreshButton({ onClick, isLoading, className = '' }: RefreshButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-outline bg-surface text-text-muted transition-all hover:bg-warm-bg hover:text-on-background active:scale-95 disabled:opacity-50 ${className}`}
            title="Refresh data"
        >
            <RefreshIcon
                size={16}
                className={`${isLoading ? 'animate-spin text-primary' : ''}`}
            />
        </button>
    );
}
