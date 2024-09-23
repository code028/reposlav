import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layouts/MainLayout';
import { useGetAllServicesByUniOwnerIdQuery } from '../../store/api/serviceSlice';
import { useAppSelector } from '../../store/hooks';
import { Plus, Search, Eye, Edit, Trash, MapPin } from 'lucide-react';

type User = {
  userId: number;
  serviceId: number;
  user: {
    name: string;
    username: string;
    email: string;
  };
};

type Service = {
  id: number;
  name: string;
  facultyId: number;
  users: User[];
};

type Faculty = {
  id: number;
  name: string;
  universityId: number;
  service: Service | null;
};

type University = {
  id: number;
  name: string;
  location: string;
  ownerId: number;
  faculties: Faculty[];
};

const ServiceHome = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  const userId = useAppSelector((state) => state.user.id);

  const { data } = useGetAllServicesByUniOwnerIdQuery(userId);

  useEffect(() => {
    if (data?.universities) {
      setUniversities(data.universities);
      const allServices = data.universities.flatMap((uni) =>
        uni.faculties.flatMap((faculty) => (faculty.service ? [faculty.service] : []))
      );
      setServices(allServices);
    }
  }, [data?.universities]);

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = e.target.value === '' ? null : parseInt(e.target.value);
    setSelectedUniversity(universityId);

    if (universityId === null) {
      const allServices = universities.flatMap((uni) =>
        uni.faculties.flatMap((faculty) => (faculty.service ? [faculty.service] : []))
      );
      setServices(allServices);
    } else {
      const university = universities.find((uni) => uni.id === universityId);
      const uniServices = university?.faculties.flatMap((faculty) => (faculty.service ? [faculty.service] : []));
      setServices(uniServices || []);
    }
  };

  // Pretraga po nazivu službe
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="w-full h-screen min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center bg-secondary-custom overflow-y-scroll">
        <div className="w-full max-w-7xl">
          {/* Naslov i dropdown */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-4 sm:py-6">
            <div className="text-2xl sm:text-3xl font-bold flex items-center gap-3 sm:gap-5 text-center md:text-left">
              {selectedUniversity
                ? universities?.find((uni) => uni.id === selectedUniversity)?.name
                : 'Све службе'}
            </div>

            {/* Dropdown za univerzitete */}
            <div className="flex gap-3 sm:gap-4 items-center mt-4 md:mt-0">
              <select
                className="border border-gray-300 py-2 px-3 sm:px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-2 transition duration-200 hover:border-black hover:border-opacity-80 max-h-48 overflow-y-auto"
                onChange={handleUniversityChange}
                value={selectedUniversity || ''}
              >
                <option value="">Изаберите универзитет</option>
                {universities?.map((uni) => (
                  <option key={uni.id} value={uni.id.toString()}>
                    {uni.name}
                  </option>
                ))}
              </select>

              <Link
                to={'/service/add'}
                className="flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 text-white font-semibold rounded-lg shadow-lg focus:border-2 transition duration-200"
              >
                <Plus className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
                Направи Службу
              </Link>
            </div>
          </div>

          {/* Prikaz detalja univerziteta i službi */}
          <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {/* Pretraga službi */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold">Службе</h3>
              <div className="relative w-full sm:w-1/3 mt-4 sm:mt-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Претражите по називу"
                  className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:border-black focus:border-2 transition duration-200 hover:border-black hover:border-opacity-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Kartice sa službama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => {
                  // Pronađi univerzitet kojem fakultет pripada
                  const university = universities?.find((uni) =>
                    uni.faculties.some((faculty) => faculty.id === service.facultyId)
                  );

                  return (
                    <div
                      key={service.id}
                      className="flex flex-col justify-between bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg hover:border-black hover:border-opacity-80 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg sm:text-xl font-semibold leading-tight">{service.name}</h4>
                        </div>

                        {/* Prikaz naziva univerziteta */}
                        {university && (
                          <div className="flex flex-col mt-2">
                            <div className="text-gray-800 font-medium text-sm mb-1">{university.name}</div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="w-4 h-4 text-red-500 mr-1" />
                              {university.location}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Akciona dugmad sa ikonama */}
                      <div className="flex items-center justify-evenly gap-3 mt-3">
                        <Link
                          to={`/uni/${university?.id}/fac/${service.facultyId}/service/${service.id}`}
                          className="bg-black bg-opacity-80 text-white p-2 rounded-full transition hover:rotate-12 duration-200"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>

                        <Link
                          to={`/uni/${university?.id}/fac/${service.facultyId}/service/${service.id}/edit`}
                          className="bg-black bg-opacity-80 text-white p-2 rounded-full transition hover:rotate-12 duration-200"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>

                        <Link
                          to={`/uni/${university?.id}/fac/${service.facultyId}/service/${service.id}/delete`}
                          className="bg-black bg-opacity-80 text-white p-2 rounded-full transition hover:rotate-12 duration-200"
                        >
                          <Trash className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">Нема служби</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServiceHome;
