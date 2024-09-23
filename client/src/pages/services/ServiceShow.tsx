import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { useGetServiceByUniFacQuery } from '../../store/api/universitySlice';
import { useParams, Link } from 'react-router-dom';
import { MapPin, User, Eye, Plus, Search, X } from 'lucide-react';

const ServiceShow = () => {
  const { id, id2, id3 } = useParams();
  const uniId = parseInt(id!);
  const facultyId = parseInt(id2!);
  const serviceId = parseInt(id3!);

  const { data } = useGetServiceByUniFacQuery({ uniId, facultyId, serviceId });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const serviceUsers = data[0].faculties[0].service?.users || [];
      setFilteredUsers(serviceUsers);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.length > 0) {
      const serviceUsers = data[0].faculties[0].service?.users || [];
      const filtered = serviceUsers.filter((user) =>
        user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, data]);

  if (!data || data.length === 0) {
    return (
      <MainLayout>
        <div className="w-full h-screen flex items-center justify-center">
          <h2 className="text-2xl font-bold">Нема података о служби</h2>
        </div>
      </MainLayout>
    );
  }

  const university = data[0];
  const faculty = university.faculties[0];
  const service = faculty.service;

  return (
    <MainLayout>
      <div className="w-full h-screen min-h-screen bg-secondary-custom p-6 flex flex-col items-center overflow-y-scroll">
        <div className="w-full max-w-7xl">
          {/* Glavni naslov */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-6 border-b-2 border-gray-200 mb-6">
            <div className="text-3xl font-bold flex items-center gap-5 text-center md:text-left">
              <User className="w-10 h-10 text-blue-600" />
              {service?.name}
            </div>
          </div>

          {/* Detalji univerziteta i fakulteta u koloni */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Детаљи о Универзитету</h3>
              <p className="text-gray-700 text-lg font-medium">{university.name}</p>
              <div className="text-gray-500 text-sm flex items-center gap-2 mt-2">
                <MapPin className="w-5 h-5 text-red-500" /> {university.location}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Детаљи о Факултету</h3>
              <p className="text-gray-700 text-lg font-medium">{faculty.name}</p>
              <p className="text-gray-500 text-sm">Факултет ID: {faculty.id}</p>
            </div>
          </div>

          {/* Search bar sa dugmićima */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="relative w-full md:w-96 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Претражите чланове службе"
                className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='w-full md:w-fit flex gap-4'>
              <Link to={`/service/${service?.id}/add`} className="flex items-center px-3 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
                <Plus className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
                Додај члана на службу
              </Link>
            </div>
          </div>

          {/* Lista članova službe */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Чланови службе</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((serviceUser) => (
                  <div key={serviceUser.userId} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-4">
                      <User className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="text-lg font-semibold">{serviceUser.user.name}</h4>
                        <p className="text-gray-500 text-sm">@{serviceUser.user.username}</p>
                        <p className="text-gray-500 text-sm">{serviceUser.user.email}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Link to={`/user/${serviceUser.userId}`} className="flex items-center gap-x-2 px-3 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg shadow transition duration-200">
                        <Eye className="w-5 h-5" /> Преглед
                      </Link>
                      <button className="flex items-center gap-x-2 px-3 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg shadow transition duration-200">
                        <X className="w-5 h-5" /> Избаци
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Нема чланова службе</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServiceShow;
