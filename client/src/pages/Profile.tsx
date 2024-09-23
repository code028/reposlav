import { useAppSelector } from '../store/hooks';
import MainLayout from '../components/layouts/MainLayout';
import Loader from '../components/ui/Loader/Loader';
import { useGetUserByIdQuery } from '../store/api/userSlice';
import { Mail, User, ShieldCheck, Building, Edit2 } from 'lucide-react';

const Profile = () => {
  const refreshToken = useAppSelector((state) => state.session.refreshToken);
  const { id, username, email, role } = useAppSelector((state) => state.user);
  const { data: userData, isLoading, error } = useGetUserByIdQuery({ id: parseInt(id), refreshToken });

  const newDate = new Date(userData?.session.createdAt!);
  const lastSeen = newDate.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <MainLayout>
      <div className="w-full h-screen overflow-y-scroll bg-gradient-to-br from-gray-100 to-gray-[150] px-4 flex justify-center items-center">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-5xl flex flex-col md:flex-row justify-between relative transition-all duration-300">
          
          {isLoading && <Loader />}
          
          {!isLoading && !error && (
            <>
              {/* Left side: Avatar and User Details */}
              <div className="flex flex-col items-center md:items-start space-y-6">
                {/* Edit Profile Button in the top-right corner */}
                <button className="absolute top-4 right-4 py-2 px-4 bg-black bg-opacity-80 text-white font-semibold rounded-lg shadow-lg hover:bg-opacity-100 transition-all flex items-center">
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                </button>

                {/* Avatar */}
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white text-6xl font-extrabold shadow-lg">
                  {username?.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="text-center md:text-left space-y-1">
                  <h1 className="text-4xl font-extrabold text-gray-900">{userData?.user.name || 'John Doe'}</h1>
                  <p className="text-xl text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="w-5 h-5 text-blue-500" /> {email}
                  </p>
                  <p className="text-lg text-gray-500 capitalize flex items-center gap-2 justify-center md:justify-start">
                    <ShieldCheck className="w-5 h-5 text-green-500" /> {role}
                  </p>
                </div>

                {/* Last Seen */}
                <div className="text-sm text-gray-400">
                  <p>Last seen: <span className="font-medium text-gray-900">{lastSeen}</span></p>
                </div>
              </div>

              {/* Right side: Additional User Info */}
              <div className="flex flex-col space-y-6">
                {/* Section with User Info in Card Style */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-md space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-6 h-6 text-indigo-500" /> Корисничке информације
                  </h2>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Username:</span>
                    <span className="text-gray-900">{username}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Email:</span>
                    <span className="text-gray-900">{email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Role:</span>
                    <span className="text-gray-900 capitalize">{role}</span>
                  </div>
                </div>

                {role === 'service' && (
                  <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                      <Building className="w-6 h-6 text-blue-500" /> Службеник на
                    </h2>
                    <p className="mt-2 text-gray-800">Random: 3 Универзитета, 6 факултета</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
