interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: string;
}

export function EmptyState({
    title,
    description,
    icon = '📋',
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <span className="text-4xl">{icon}</span>
            <h3 className="text-lg font-semibold text-on-background">{title}</h3>
            {description && (
                <p className="max-w-sm text-sm text-text-muted">{description}</p>
            )}
        </div>
    );
}
