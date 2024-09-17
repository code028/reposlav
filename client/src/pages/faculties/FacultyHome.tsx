// import { Edit, Eye, GraduationCap, MapPin, Plus, Search, UniversityIcon } from 'lucide-react';
// import MainLayout from '../../components/layouts/MainLayout'
// import { useEffect, useState } from 'react';
// import { Faculty, University } from '../../store/types/university';
// import { useGetUnisByOwnerQuery } from '../../store/api/universitySlice';
// import { useAppSelector } from '../../store/hooks';
// import { Link } from 'react-router-dom';

// const FacultyHome = () => {
//   const [universities, setUniversities] = useState<University[]>();
//   const [searchTerm, setSearchTerm] = useState('');

//   const id = useAppSelector((state) => state.user.id);

//   const { data, isLoading: uniLoading } = useGetUnisByOwnerQuery(id);
  
//   useEffect(() => {
//     if (data?.universities) {
//       setUniversities(data.universities);
//     }
//   }, [data?.universities]);

//   const filteredUniversities = universities?.filter((university) =>
//     university.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   return (
//     <MainLayout>
//       <div className="w-full h-screen min-h-screen bg-secondary-custom p-6 flex flex-col items-center overflow-y-scroll">
//         <div className="w-full max-w-7xl">
//           {/* Naslov i pretrazivanje */}
//           <div className="w-full flex flex-col md:flex-row justify-between items-center py-6">
//             <div className="text-3xl font-bold flex items-center gap-5 text-center md:text-left mb-4 md:mb-0">
//               <GraduationCap className="w-8 h-8 text-blue-600" />
//               Сви факултети
//             </div>
//             <div className="relative w-full md:w-96">
//               {/* Ikona pretrage */}
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="w-5 h-5 text-gray-500" />
//               </div>
//               {/* Input za pretragu */}
//               <input
//                 type="text"
//                 placeholder="Претражите универзитете"
//                 className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className='w-full flex justify-end'>
//             <Link to={"/uni/add"} className="flex items-center px-5 py-3 bg-black bg-opacity-80 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300">
//               <Plus className="w-6 h-6 mr-2" />
//               Додај Универзитет
//             </Link>
//           </div>

//           {/* Kartice sa univerzitetima */}
//           <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
//             {uniLoading ? (
//               <div className="col-span-full flex justify-center items-center text-lg font-semibold">Loading...</div>
//             ) : filteredUniversities && filteredUniversities.length > 0 ? (
//               filteredUniversities.map((uni) => (
//                 <div
//                   key={uni.id}
//                   className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 hover:shadow-2xl transition duration-300 "
//                 >
//                   {/* Naslov univerziteta */}
//                   <div className="flex items-center gap-2 text-xl font-semibold">
//                     <GraduationCap className="w-6 h-6 text-blue-600" />
//                     {uni.name}
//                   </div>
//                   {/* Lokacija */}
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <MapPin className="w-5 h-5 text-red-500" />
//                     {uni.location}
//                   </div>
//                   {/* Broj fakulteta */}
//                   <div className="mt-4">
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <GraduationCap className="w-6 h-6 text-green-500" />
//                       {uni.faculties?.length || 0} {uni.faculties?.length === 1 ? 'Факултет' : 'Факултета'}
//                     </h3>
//                   </div>
//                   <div className='w-full flex gap-3 justify-center items-center'>
//                     {/* Dugme za detalje */}
//                     <Link to={`/uni/${uni.id}`} className="w-1/2 flex justify-center items-center mt-auto bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
//                       <Eye />
//                     </Link>
//                     {/* Dugme za edit */}
//                     <Link to={`/uni/${uni.id}/edit`} className="w-1/2 flex justify-center items-center mt-auto bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
//                       <Edit />
//                     </Link>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="flex flex-1 justify-center items-center col-span-full text-center text-gray-500">Тражени универзитети не постоје</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }

// export default FacultyHome
import { useEffect, useState } from 'react';
import { GraduationCap, Plus, Search, Eye, Edit, Trash, MapPin, DiamondPlus } from 'lucide-react';
import { useGetUnisByOwnerQuery } from '../../store/api/universitySlice';
import { Faculty, University } from '../../store/types/university';
import { useAppSelector } from '../../store/hooks';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layouts/MainLayout';

const FacultyHome = () => {
  const [universities, setUniversities] = useState<University[]>();
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  const userId = useAppSelector((state) => state.user.id);

  const { data, isLoading: uniLoading } = useGetUnisByOwnerQuery(userId);

  useEffect(() => {
    if (data?.universities) {
      setUniversities(data.universities);
      const allFaculties = data.universities.flatMap((uni) => uni.faculties); 
      setFaculties(allFaculties); 
    }
  }, [data?.universities]);

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = e.target.value === '' ? null : parseInt(e.target.value);
    setSelectedUniversity(universityId);

    if (universityId === null) {
      const allFaculties = universities?.flatMap((uni) => uni.faculties) || [];
      setFaculties(allFaculties);
    } else {
      const university = universities?.find((uni) => uni.id === universityId);
      setFaculties(university?.faculties || []);
    }
  };

  // Pretraga samo po nazivu fakulteta
  const filteredFaculties = faculties?.filter((faculty) =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUniversityData = universities?.find((uni) => uni.id === selectedUniversity);

  return (
    <MainLayout>
      <div className="w-full h-screen min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center bg-secondary-custom overflow-y-scroll">
        <div className="w-full max-w-7xl">
          {/* Naslov i dropdown */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-4 sm:py-6">
            <div className="text-2xl sm:text-3xl font-bold flex items-center gap-3 sm:gap-5 text-center md:text-left">
              <GraduationCap className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
              {selectedUniversity ? selectedUniversityData?.name : 'Сви факултети'}
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

              <Link to={'/faculty/add'} className="flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 text-white font-semibold rounded-lg shadow-lg focus:border-2 transition duration-200">
                <Plus className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
                Додај Факултет
              </Link>
            </div>
          </div>

          {/* Prikaz detalja univerziteta i fakulteta */}
          <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {/* Pretraga fakultета */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold">Факултети</h3>
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

            {/* Kartice sa fakultetima */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredFaculties.length > 0 ? (
                filteredFaculties.map((faculty) => {
                  const university = universities?.find((uni) => uni.id === parseInt(faculty.universityId.toString()));
                  return (
                    <div
                      key={faculty.id}
                      className="flex flex-col justify-between bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg hover:border-black hover:border-opacity-80 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                          <h4 className="text-lg sm:text-xl font-semibold leading-tight">{faculty.name}</h4>
                        </div>

                        {/* Naziv i lokacija univerziteta */}
                        {university && (
                          <div className="flex flex-col mt-2">
                            <div className="text-gray-800 font-medium text-sm mb-1">
                              {university.name}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="w-4 h-4 text-red-500 mr-1" />
                              {university.location}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Akciona dugmad sa ikonama */}
                      <div className="flex items-center justify-evenly gap-3 mt-3">
                        <Link to={`/uni/${university?.id}/fac/${faculty.id}`} className="bg-black bg-opacity-80 text-white p-2 rounded-full transition hover:rotate-12 duration-200">
                          <Eye className="w-5 h-5" />
                        </Link>

                        <Link to={`/uni/${university?.id}/fac/${faculty.id}/edit`} className="bg-black bg-opacity-80 text-white p-2 rounded-full transition hover:rotate-12 duration-200">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <Link to={`/uni/${university?.id}/fac/${faculty.id}/dep/add`} className="bg-black bg-opacity-80 text-white p-2 rounded-full transition hover:rotate-12 duration-200">
                          <DiamondPlus className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">Нема факултета</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FacultyHome;
