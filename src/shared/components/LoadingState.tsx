interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
            {/* Spinner */}
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-outline border-t-primary" />
            <p className="text-sm text-text-muted">{message}</p>
        </div>
    );
}
