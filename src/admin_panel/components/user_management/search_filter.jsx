import { ClockIcon } from '@heroicons/react/24/outline';

const SearchFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-background-secondary p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ClockIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter; 