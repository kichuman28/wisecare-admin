import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { useAuth } from '../../../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  VideoCameraIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const DoctorDashboard = () => {
  const { user, userData } = useAuth();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Fetch doctor details
        const doctorDoc = await getDocs(query(
          collection(db, 'doctors'),
          where('uid', '==', user.uid)
        ));

        if (!doctorDoc.empty) {
          setDoctorDetails(doctorDoc.docs[0].data());
        }

        // Fetch upcoming appointments (you can implement this later)
        // For now, we'll use static data
        setUpcomingAppointments([
          {
            id: 1,
            patientName: "Mrs. Sarah Johnson",
            age: 72,
            appointmentType: "Regular Checkup",
            time: "09:30 AM",
            date: "Today",
            status: "Confirmed",
            notes: "Regular heart checkup, blood pressure monitoring",
            isOnline: false
          },
          {
            id: 2,
            patientName: "Mr. Robert Wilson",
            age: 68,
            appointmentType: "Video Consultation",
            time: "11:00 AM",
            date: "Today",
            status: "Upcoming",
            notes: "Follow-up on medication adjustment",
            isOnline: true
          },
          {
            id: 3,
            patientName: "Ms. Emily Brown",
            age: 75,
            appointmentType: "Emergency",
            time: "02:30 PM",
            date: "Today",
            status: "Pending",
            notes: "Severe joint pain, urgent consultation needed",
            isOnline: false
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchDoctorData();
    }
  }, [user]);

  const stats = [
    {
      title: "Today's Patients",
      value: upcomingAppointments.length.toString(),
      change: "+2",
      icon: UserGroupIcon,
      color: "blue"
    },
    {
      title: "Avg. Consultation Time",
      value: "22m",
      change: "-3m",
      icon: ClockIcon,
      color: "green"
    },
    {
      title: "Patient Satisfaction",
      value: doctorDetails?.rating?.toFixed(1) + "/5" || "N/A",
      change: "+0.2",
      icon: StarIcon,
      color: "amber"
    },
    {
      title: "Total Patients",
      value: doctorDetails?.patientsServed?.toString() || "0",
      change: "+3",
      icon: VideoCameraIcon,
      color: "purple"
    }
  ];

  if (loading) {
    return (
      <DoctorLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="text-white">
              <h1 className="text-2xl font-bold">Welcome back, {doctorDetails?.name || userData?.name}</h1>
              <p className="mt-1 text-primary-light">You have {upcomingAppointments.length} appointments today</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-white text-primary rounded-lg hover:bg-primary-light transition-all">
                <VideoCameraIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Start Consultation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                <span className="text-gray-600 text-sm ml-2">vs yesterday</span>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
              <button className="text-primary hover:text-primary-hover font-medium text-sm transition-colors">
                View All →
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.appointmentType} • Age: {appointment.age}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {appointment.time}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'Confirmed' 
                            ? 'bg-green-50 text-green-700'
                            : appointment.status === 'Pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {appointment.status}
                        </span>
                        {appointment.isOnline && (
                          <span className="inline-flex items-center text-xs font-medium text-violet-600">
                            <VideoCameraIcon className="h-4 w-4 mr-1" />
                            Online Consultation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <ClipboardDocumentCheckIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">{appointment.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-3">
                  {appointment.isOnline ? (
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all">
                      Start Video Call
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard; 