import { BellIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-gray-100">
      <div className="flex items-center flex-1">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        <div className="ml-8 relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 border-l pl-4 ml-2">
          <UserCircleIcon className="h-8 w-8 text-gray-600" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Admin User</span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 