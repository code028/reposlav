import { useEffect, useState } from 'react'
import MainLayout from '../../components/layouts/MainLayout'
import { Edit, Eye, GraduationCap, MapPin, Plus, Search, UniversityIcon } from 'lucide-react';
import { useGetUnisByOwnerQuery } from '../../store/api/universitySlice';
import { useAppSelector } from '../../store/hooks';
import { University } from '../../store/types/university';
import { Link } from 'react-router-dom';



const UniversityHome = () => {
  const [universities, setUniversities] = useState<University[]>();
  const [searchTerm, setSearchTerm] = useState('');

  const id = useAppSelector((state) => state.user.id);

  const { data, isLoading: uniLoading } = useGetUnisByOwnerQuery(id);
  
  useEffect(() => {
    if (data?.universities) {
      setUniversities(data.universities);
    }
  }, [data?.universities]);

  const filteredUniversities = universities?.filter((university) =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <MainLayout>
      <div className="w-full h-screen min-h-screen bg-secondary-custom p-6 flex flex-col items-center overflow-y-scroll">
        <div className="w-full max-w-7xl">
          {/* Naslov i pretrazivanje */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-6">
            <div className="text-3xl font-bold flex items-center gap-5 text-center md:text-left mb-4 md:mb-0">
              <UniversityIcon className="w-8 h-8 text-blue-600" />
              Универзитети
            </div>
            <div className="relative w-full md:w-96">
              {/* Ikona pretrage */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              {/* Input za pretragu */}
              <input
                type="text"
                placeholder="Претражите универзитете"
                className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='w-full flex justify-end'>
            <Link to={"/uni/add"} className="flex items-center px-5 py-3 bg-black bg-opacity-80 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300">
              <Plus className="w-6 h-6 mr-2" />
              Додај Универзитет
            </Link>
          </div>

          {/* Kartice sa univerzitetima */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
            {uniLoading ? (
              <div className="col-span-full flex justify-center items-center text-lg font-semibold">Loading...</div>
            ) : filteredUniversities && filteredUniversities.length > 0 ? (
              filteredUniversities.map((uni) => (
                <div
                  key={uni.id}
                  className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 hover:shadow-2xl transition duration-300 "
                >
                  {/* Naslov univerziteta */}
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <UniversityIcon className="w-6 h-6 text-blue-600" />
                    {uni.name}
                  </div>
                  {/* Lokacija */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-red-500" />
                    {uni.location}
                  </div>
                  {/* Broj fakulteta */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-green-500" />
                      {uni.faculties?.length || 0} {uni.faculties?.length === 1 ? 'Факултет' : 'Факултета'}
                    </h3>
                  </div>
                  <div className='w-full flex gap-3 justify-center items-center'>
                    {/* Dugme za detalje */}
                    <Link to={`/uni/${uni.id}`} className="w-1/2 flex justify-center items-center mt-auto bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
                      <Eye />
                    </Link>
                    {/* Dugme za edit */}
                    <Link to={`/uni/${uni.id}/edit`} className="w-1/2 flex justify-center items-center mt-auto bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
                      <Edit />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-1 justify-center items-center col-span-full text-center text-gray-500">Тражени универзитети не постоје</div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UniversityHome