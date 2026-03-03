// ---------------------------------------------------------------------------
// Placeholder pages — replace with feature modules as they are built
// ---------------------------------------------------------------------------

export function AdminDashboardPage() {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <p className="mt-2 text-sm text-gray-500">
                Platform overview — stats, pending requests, and recent alerts will go here.
            </p>
        </div>
    );
}

export function AdminServiceRequestsPage() {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800">Service Requests</h2>
            <p className="mt-2 text-sm text-gray-500">
                All service requests across all elderly users.
            </p>
        </div>
    );
}

export function AdminUsersPage() {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            <p className="mt-2 text-sm text-gray-500">
                User management — list, create agents, activate/deactivate.
            </p>
        </div>
    );
}

export function AdminAlertsPage() {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800">Alerts</h2>
            <p className="mt-2 text-sm text-gray-500">
                All health alerts across all elderly users.
            </p>
        </div>
    );
}
