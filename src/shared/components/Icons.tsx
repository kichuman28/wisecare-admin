/**
 * Shared SVG icons in WiseCare brand style.
 * All icons accept `className` for sizing/color override.
 * Default: 20×20, currentColor stroke.
 */

interface IconProps {
    className?: string;
    size?: number;
}

const defaults = (size: number) => ({
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
});

export function DashboardIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

export function RequestsIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
        </svg>
    );
}

export function AlertIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

export function UsersIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

export function ClipboardIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="15" y2="16" />
        </svg>
    );
}

export function RefreshIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
    );
}

export function ShieldIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}

export function HeartIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

export function CheckCircleIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

export function XCircleIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    );
}

export function ActivityIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}

export function AlertTriangleIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

export function InfoIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

export function AlertCriticalIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M2.73 21h18.53a1 1 0 0 0 .87-1.5L13.87 3.5a1 1 0 0 0-1.74 0L3.6 19.5a1 1 0 0 0-.87 1.5z" fill="currentColor" fillOpacity="0.15" />
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
    );
}

export function MailCheckIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9" />
            <polyline points="22 7 13.5 12.5 2 7" />
            <polyline points="16 19 18 21 22 17" />
        </svg>
    );
}

export function LogOutIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

export function StarIcon({ className, size = 20 }: IconProps) {
    return (
        <svg {...defaults(size)} className={className} fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
