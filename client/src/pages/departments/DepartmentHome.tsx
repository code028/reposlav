import { useEffect, useState } from 'react';
import { Search, Eye, Edit, Notebook, GraduationCap, UniversityIcon, Plus } from 'lucide-react';
import MainLayout from '../../components/layouts/MainLayout';
import { useGetFacsByServiceWhereUserIdQuery } from '../../store/api/departmentSlice';
import { useAppSelector } from '../../store/hooks';
import { Link } from 'react-router-dom';

const DepartmentHome = () => {
  const serviceId = useAppSelector((state) => state.user.id);
  const userRole = useAppSelector((state) => state.user.role);

  const { data: unis } = useGetFacsByServiceWhereUserIdQuery(serviceId);

  const [faculties, setFaculties] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);

  useEffect(() => {
    if (unis?.faculties) {
      setFaculties(unis.faculties);
      const allDepartments = unis.faculties.flatMap((faculty) => faculty.departments);
      setDepartments(allDepartments);
    }
  }, [unis]);

  // Filtriranje na osnovu pretrage, tipa, fakulteta i univerziteta
  const filteredDepartments = departments.filter((department) => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? department.type === selectedType : true;
    const matchesFaculty = selectedFaculty ? department.facultyId === selectedFaculty : true;
    const faculty = faculties.find((fac) => fac.id === department.facultyId);
    const matchesUniversity = selectedUniversity ? faculty?.university.id === selectedUniversity : true;
    return matchesSearch && matchesType && matchesFaculty && matchesUniversity;
  });

  // Odvajanje po tipu studija
  const osnovneStudije = filteredDepartments.filter((dep) => dep.type === 'osnovne');
  const masterStudije = filteredDepartments.filter((dep) => dep.type === 'master');

  // Fakulteti koji pripadaju izabranom univerzitetu
  const filteredFaculties = selectedUniversity
    ? faculties.filter((faculty) => faculty.university.id === selectedUniversity)
    : faculties;

  return (
    <MainLayout>
      <div className="w-full h-screen min-h-screen bg-secondary-custom p-6 flex flex-col items-center overflow-y-scroll">
        <div className="w-full max-w-7xl">
          {/* Naslov i pretrazivanje */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-6">
            <div className="text-3xl font-bold flex items-center gap-5 text-center md:text-left mb-4 md:mb-0">
              <Notebook className="w-8 h-8 text-blue-600" />
              Сви одсеци
            </div>
            <div className="relative w-full md:w-96">
              {/* Ikona pretrage */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              {/* Input za pretragu */}
              <input
                type="text"
                placeholder="Претражите одсеке"
                className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='w-full flex justify-end pb-2'>
            <Link to={'/dep/add'} className="w-full sm:w-fit flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 text-white font-semibold rounded-lg shadow-lg focus:border-2 transition duration-200">
              <Plus className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
              Додај Одсек
            </Link>
          </div>
          {/* Dropdown za fakultete, tip studija i univerzitete */}
          <div className="w-full flex flex-col xl:flex-row sm:justify-between gap-4 mb-4">
            {/* Dropdown za univerzitete */}
            <select
              className="w-full sm:w-auto border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedUniversity || ''}
              onChange={(e) => {
                setSelectedUniversity(parseInt(e.target.value));
                setSelectedFaculty(null); // Resetujemo izabrani fakultet
              }}
            >
              <option value="">Сви универзитети</option>
              {faculties
                .map((faculty) => faculty.university) // Mapiramo univerzitete
                .filter((uni, index, self) => self.findIndex((u) => u.id === uni.id) === index) // Uklanjamo duplikate
                .map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
            </select>

            {/* Dropdown za fakultete */}
            <select
              className="w-full sm:w-auto border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedFaculty || ''}
              onChange={(e) => setSelectedFaculty(parseInt(e.target.value))}
              disabled={filteredFaculties.length === 0} // Onemogućeno ako nema fakulteta
            >
              <option value="">Сви факултети</option>
              {filteredFaculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>

            {/* Dropdown za tip studija */}
            <select
              className="w-full sm:w-auto border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Сви типови студија</option>
              <option value="osnovne">Основне студије</option>
              <option value="master">Мастер студије</option>
            </select>
          </div>

          {/* Kartice sa odsecima, grupisane po tipu studija */}
          <div className="py-6">
            {/* Sekcija za osnovne studije */}
            {osnovneStudije.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Основне студије</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {osnovneStudije.map((dep) => {
                    const faculty = faculties.find((fac) => fac.id === dep.facultyId);
                    return (
                      <div
                        key={dep.id}
                        className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 hover:shadow-2xl transition duration-300"
                      >
                        {/* Naslov odseka */}
                        <div className="flex items-center gap-2 text-xl font-semibold">
                          <Notebook className="w-6 h-6 text-blue-600" />
                          {dep.name}
                        </div>
                        {/* Ime fakulteta */}
                        <div className="text-gray-700">
                          <GraduationCap className="w-4 h-4 text-green-600 inline-block mr-2" />
                          {faculty?.name}
                        </div>
                        {/* Ime univerziteta */}
                        <div className="text-gray-700 mt-1">
                          <UniversityIcon className="w-4 h-4 text-blue-600 inline-block mr-2" />
                          {faculty?.university.name}
                        </div>
                        {/* Dugmad za akcije */}
                        <div className="w-full flex gap-3 justify-center items-center mt-4">
                          <Link to={`/uni/${faculty.university.id}/fac/${dep.facultyId}/dep/${dep.id}`} className="w-1/2 flex justify-center items-center bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
                            <Eye />
                          </Link>
                          <Link to={`/uni/${faculty.university.id}/fac/${dep.facultyId}/dep/${dep.id}/edit`} className="w-1/2 flex justify-center items-center bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
                            <Edit />
                          </Link>
                        </div>
                        {userRole === 'admin' && 
                          <div className='w-full flex'>
                            <Link to={`/uni/${faculty.university.id}/fac/${dep.facultyId}/dep/add`} className="w-full flex justify-center items-center bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
                              <Plus />
                            </Link>
                          </div>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sekcija za master studije */}
            {masterStudije.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Мастер студије</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {masterStudije.map((dep) => {
                    const faculty = faculties.find((fac) => fac.id === dep.facultyId);
                    return (
                      <div
                        key={dep.id}
                        className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 hover:shadow-2xl transition duration-300"
                      >
                        {/* Naslov odseka */}
                        <div className="flex items-center gap-2 text-xl font-semibold">
                          <Notebook className="w-6 h-6 text-blue-600" />
                          {dep.name}
                        </div>
                        {/* Ime fakulteta */}
                        <div className="text-gray-700">
                          <GraduationCap className="w-4 h-4 text-green-600 inline-block mr-2" />
                          {faculty?.name}
                        </div>
                        {/* Ime univerziteta */}
                        <div className="text-gray-700 mt-1">
                          <UniversityIcon className="w-4 h-4 text-blue-600 inline-block mr-2" />
                          {faculty?.university.name}
                        </div>
                        {/* Dugmad za akcije */}
                        <div className="w-full flex gap-3 justify-center items-center mt-4">
                          <Link to={`/uni/${faculty.university.id}/fac/${dep.facultyId}/dep/${dep.id}`} className="w-1/2 flex justify-center items-center bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
                            <Eye />
                          </Link>
                          <Link to={`/uni/${faculty.university.id}/fac/${dep.facultyId}/dep/${dep.id}/edit`} className="w-1/2 flex justify-center items-center bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
                            <Edit />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DepartmentHome;
