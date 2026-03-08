import { CustomSelect } from './CustomSelect';

export interface PaginationProps {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    pageSize,
    totalItems,
    pageSizeOptions = [10, 25, 50, 100],
    onPageChange,
    onPageSizeChange,
    className = '',
}: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const sizeOptions = pageSizeOptions.map((size) => ({
        label: `${size}`,
        value: size,
    }));

    return (
        <div className={`flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface p-4 ring-1 ring-outline ${className}`}>
            <div className="text-sm text-text-muted">
                Showing <span className="font-semibold text-on-background">{totalItems > 0 ? startItem : 0}</span> to{' '}
                <span className="font-semibold text-on-background">{endItem}</span> of{' '}
                <span className="font-semibold text-on-background">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-medium uppercase text-text-muted">Rows per page:</label>
                    <CustomSelect
                        value={pageSize}
                        options={sizeOptions}
                        onChange={(val) => onPageSizeChange(val as number)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-muted ring-1 ring-outline transition-colors hover:bg-warm-bg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="min-w-[4rem] text-center text-sm font-medium text-on-background">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-muted ring-1 ring-outline transition-colors hover:bg-warm-bg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
