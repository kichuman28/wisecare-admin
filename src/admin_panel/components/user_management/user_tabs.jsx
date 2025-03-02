import { Tab } from '@headlessui/react';
import { 
  UserIcon, 
  BriefcaseIcon, 
  ShieldCheckIcon, 
  TruckIcon 
} from '@heroicons/react/24/outline';
import { 
  PatientRow, 
  DoctorRow, 
  ResponderRow, 
  DeliveryRow 
} from './user_rows';

const UserTabs = ({ 
  patients, 
  doctors, 
  responders, 
  deliveryStaff, 
  searchTerm,
  onEditUser,
  onDeleteUser,
  selectedTab,
  setSelectedTab
}) => {
  // Filter function for search
  const filterData = (data) => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  };

  return (
    <Tab.Group onChange={setSelectedTab} selectedIndex={selectedTab}>
      <Tab.List className="flex space-x-1 rounded-xl bg-primary-light/20 p-1 mb-6 overflow-x-auto">
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 whitespace-nowrap
          ${selected 
            ? 'bg-white shadow text-primary'
            : 'text-primary-hover hover:bg-white/[0.12] hover:text-primary'}`
        }>
          <div className="flex items-center justify-center">
            <UserIcon className="h-4 w-4 mr-1.5" />
            Patients ({patients.length})
          </div>
        </Tab>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 whitespace-nowrap
          ${selected 
            ? 'bg-white shadow text-primary'
            : 'text-primary-hover hover:bg-white/[0.12] hover:text-primary'}`
        }>
          <div className="flex items-center justify-center">
            <BriefcaseIcon className="h-4 w-4 mr-1.5" />
            Doctors ({doctors.length})
          </div>
        </Tab>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 whitespace-nowrap
          ${selected 
            ? 'bg-white shadow text-primary'
            : 'text-primary-hover hover:bg-white/[0.12] hover:text-primary'}`
        }>
          <div className="flex items-center justify-center">
            <ShieldCheckIcon className="h-4 w-4 mr-1.5" />
            Responders ({responders.length})
          </div>
        </Tab>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 whitespace-nowrap
          ${selected 
            ? 'bg-white shadow text-primary'
            : 'text-primary-hover hover:bg-white/[0.12] hover:text-primary'}`
        }>
          <div className="flex items-center justify-center">
            <TruckIcon className="h-4 w-4 mr-1.5" />
            Delivery ({deliveryStaff.length})
          </div>
        </Tab>
      </Tab.List>

      <Tab.Panels>
        {/* Patients Tab Panel */}
        <Tab.Panel>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(patients).length > 0 ? (
                    filterData(patients).map((patient) => (
                      <PatientRow 
                        key={patient.id} 
                        patient={patient} 
                        onEdit={onEditUser}
                        onDelete={onDeleteUser}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No patients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tab.Panel>

        {/* Doctors Tab Panel */}
        <Tab.Panel>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered Date
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(doctors).length > 0 ? (
                    filterData(doctors).map((doctor) => (
                      <DoctorRow 
                        key={doctor.id} 
                        doctor={doctor} 
                        onEdit={onEditUser}
                        onDelete={onDeleteUser}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No doctors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tab.Panel>

        {/* Responders Tab Panel */}
        <Tab.Panel>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responder
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(responders).length > 0 ? (
                    filterData(responders).map((responder) => (
                      <ResponderRow 
                        key={responder.id} 
                        responder={responder} 
                        onEdit={onEditUser}
                        onDelete={onDeleteUser}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No responders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tab.Panel>

        {/* Delivery Tab Panel */}
        <Tab.Panel>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Personnel
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shift
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(deliveryStaff).length > 0 ? (
                    filterData(deliveryStaff).map((delivery) => (
                      <DeliveryRow 
                        key={delivery.id} 
                        delivery={delivery} 
                        onEdit={onEditUser}
                        onDelete={onDeleteUser}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No delivery personnel found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default UserTabs; 