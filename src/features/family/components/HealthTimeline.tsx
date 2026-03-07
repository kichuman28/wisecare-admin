// The timeline API endpoint is not yet implemented on the backend.
// We are rendering an empty state for now.
export function HealthTimeline({ elderlyUserId }: { elderlyUserId: string }) {
    // The timeline API endpoint is not yet implemented on the backend.
    // We will render an empty state for now.
    const events: any[] = [];

    return (
        <div className="glass-panel glass-card-hover flex flex-col rounded-2xl p-6 h-full">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-extrabold tracking-tight text-on-background">Health Timeline</h2>
                <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    Recent
                </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                <span className="mb-2 text-3xl">⏱️</span>
                <p className="text-sm font-medium text-text-muted">Health Timeline is coming soon.</p>
                <p className="text-xs text-text-muted mt-2">Activity history is currently not available.</p>
            </div>
        </div>
    );
}
