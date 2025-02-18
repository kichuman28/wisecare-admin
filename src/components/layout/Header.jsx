import { BellIcon, UserCircleIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = ({ onMenuClick, isSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-8 border-b border-gray-100">
      <div className="flex items-center flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 truncate ml-2 lg:ml-0">Wise Care</h2>
        <div className="hidden md:flex ml-8 relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
        <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 relative">
          <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2 sm:space-x-3 border-l pl-2 sm:pl-4 ml-1 sm:ml-2">
          <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-600" />
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-gray-700 truncate">Admin User</span>
            <span className="text-xs text-gray-500 truncate">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 