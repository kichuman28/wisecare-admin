import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const OrderFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Search orders or patients..."
          className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      </div>
      <select
        className="py-2.5 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="dispatched">Dispatched</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default OrderFilters; 