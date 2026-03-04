import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Column definition
// ---------------------------------------------------------------------------

export interface Column<T> {
    /** Unique key — also used as React key */
    key: string;
    /** Header label */
    header: string;
    /** Default: left */
    align?: 'left' | 'center' | 'right';
    /** Render the cell content (defaults to `String(row[key])`) */
    render: (row: T) => ReactNode;
}

// ---------------------------------------------------------------------------
// DataTable component
// ---------------------------------------------------------------------------

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    /** Unique key extractor for each row */
    rowKey: (row: T) => string;
    className?: string;
}

export function DataTable<T>({
    columns,
    data,
    rowKey,
    className = '',
}: DataTableProps<T>) {
    const alignClass = (align?: string) => {
        if (align === 'center') return 'text-center';
        if (align === 'right') return 'text-right';
        return 'text-left';
    };

    return (
        <div className={`overflow-x-auto rounded-xl border border-gray-200 bg-white ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${alignClass(col.align)}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((row) => (
                        <tr
                            key={rowKey(row)}
                            className="transition-colors hover:bg-gray-50"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={`whitespace-nowrap px-4 py-3 text-sm text-gray-700 ${alignClass(col.align)}`}
                                >
                                    {col.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
