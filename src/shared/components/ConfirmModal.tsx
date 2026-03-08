import { useEffect } from 'react';

export interface ConfirmModalProps {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    confirmStyle?: 'danger' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmStyle = 'primary',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onCancel]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6"
            onClick={handleBackdropClick}
        >
            <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-card-surface shadow-2xl ring-1 ring-outline animate-[fadeIn_150ms_ease-out]">
                <div className="px-6 py-6">
                    <h2 className="text-lg font-bold text-on-background">{title}</h2>
                    <p className="mt-2 text-sm text-text-muted">{description}</p>
                </div>

                <div className="flex shrink-0 gap-3 border-t border-outline bg-warm-bg px-6 py-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary ring-1 ring-outline hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 ${confirmStyle === 'danger'
                                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                : 'bg-primary hover:bg-primary-hover focus:ring-primary'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
