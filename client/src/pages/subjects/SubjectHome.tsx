import { useEffect, useState } from 'react';
import { Search, Eye, Edit, Notebook, GraduationCap, UniversityIcon, Plus, Book } from 'lucide-react';
import MainLayout from '../../components/layouts/MainLayout';
import { useAppSelector } from '../../store/hooks';
import { Link } from 'react-router-dom';
import { Department, Faculty, University, SubjectOnDepartment } from '../../store/api/subjectSlice';
import { useGetDepsOnFacsWhereServiceHasUserWithIdQuery } from '../../store/api/subjectSlice';

const SubjectHome = () => {
  const serviceId = useAppSelector((state) => state.user.id);

  const { data: universitiesData } = useGetDepsOnFacsWhereServiceHasUserWithIdQuery(serviceId);
  
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<SubjectOnDepartment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);

  useEffect(() => {
    if (universitiesData?.universities) {
      const allFaculties = universitiesData.universities.flatMap((university: University) => university.faculties);
      setFaculties(allFaculties);

      const allDepartments = allFaculties.flatMap((faculty: Faculty) => faculty.departments);
      setDepartments(allDepartments);

      const allSubjects = allDepartments.flatMap((department: Department) => department.subjects);
      setSubjects(allSubjects);
    }
  }, [universitiesData]);

  const filteredSubjects = subjects.filter((subjectOnDepartment) => {
    const { subject } = subjectOnDepartment;
    const department = departments.find(dep => dep.id === subjectOnDepartment.departmentId);
    const faculty = faculties.find(fac => fac.id === department?.facultyId);

    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? department?.type === selectedType : true;
    const matchesFaculty = selectedFaculty ? department?.facultyId === selectedFaculty : true;
    const matchesUniversity = selectedUniversity ? faculty?.universityId === selectedUniversity : true;

    return matchesSearch && matchesType && matchesFaculty && matchesUniversity;
  });

  const filteredFaculties = selectedUniversity
    ? faculties.filter((faculty) => faculty.universityId === selectedUniversity)
    : faculties;

  const osnovneStudije = filteredSubjects.filter((subjectOnDepartment) => {
    const department = departments.find(dep => dep.id === subjectOnDepartment.departmentId);
    return department?.type === 'osnovne';
  });

  const masterStudije = filteredSubjects.filter((subjectOnDepartment) => {
    const department = departments.find(dep => dep.id === subjectOnDepartment.departmentId);
    return department?.type === 'master';
  });

  return (
    <MainLayout>
      <div className="w-full h-screen min-h-screen bg-secondary-custom p-6 flex flex-col items-center overflow-y-scroll">
        <div className="w-full max-w-7xl">
          {/* Naslov i pretrazivanje */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-6">
            <div className="text-3xl font-bold flex items-center gap-5 text-center md:text-left mb-4 md:mb-0">
              <Notebook className="w-8 h-8 text-blue-600" />
              Сви предмети
            </div>
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Претражите предмете"
                className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='w-full flex justify-end pb-2'>
            <Link to={'/sub/add'} className="w-full sm:w-fit flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
              <Plus className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
              Додај Предмет
            </Link>
          </div>

          {/* Dropdown za filtere */}
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
                .map((faculty) => faculty.universityId)
                .filter((uniId, index, self) => self.indexOf(uniId) === index)
                .map((universityId) => {
                  const university = universitiesData?.universities.find(u => u.id === universityId);
                  return (
                    <option key={university?.id} value={university?.id}>
                      {university?.name}
                    </option>
                  );
                })}
            </select>

            {/* Dropdown za fakultete */}
            <select
              className="w-full sm:w-auto border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedFaculty || ''}
              onChange={(e) => setSelectedFaculty(parseInt(e.target.value))}
              disabled={filteredFaculties.length === 0}
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

          {/* Grupisanje i prikaz predmeta */}
          <div className="py-6">
            {osnovneStudije.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Основне студије</h2>
                <div className="flex flex-col gap-4">
                  {osnovneStudije.map((subjectOnDepartment) => {
                    const { subject } = subjectOnDepartment;
                    const department = departments.find(dep => dep.id === subjectOnDepartment.departmentId);
                    const faculty = faculties.find(fac => fac.id === department?.facultyId);
                    const university = universitiesData?.universities.find(u => u.id === faculty?.universityId);
                    return (
                      <div key={subject.id} className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center hover:shadow-2xl transition duration-300">
                        <div className="flex items-center gap-4">
                          <Book className="w-6 h-6 text-blue-600" />
                          <div>
                            <div className="text-xl font-semibold">{subject.name}</div>
                            <div className="text-gray-700">
                              <GraduationCap className="w-4 h-4 text-green-600 inline-block mr-2" />
                              {faculty?.name}
                            </div>
                            <div className="text-gray-700 mt-1">
                              <UniversityIcon className="w-4 h-4 text-blue-600 inline-block mr-2" />
                              {university?.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <Link to={`/sub/${subject.id}`} className="w-max-[250px] flex justify-center items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
                            <Eye className="w-5 sm:w-6 h-5 sm:h-6 mr-2" /> Преглед
                          </Link>
                          <Link to={`/sub/${subject.id}`} className="w-max-[250px] flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
                            <Edit className="w-5 sm:w-6 h-5 sm:h-6 mr-2" /> Измена
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {masterStudije.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Мастер студије</h2>
                <div className="flex flex-col gap-4">
                  {masterStudije.map((subjectOnDepartment) => {
                    const { subject } = subjectOnDepartment;
                    const department = departments.find(dep => dep.id === subjectOnDepartment.departmentId);
                    const faculty = faculties.find(fac => fac.id === department?.facultyId);
                    const university = universitiesData?.universities.find(u => u.id === faculty?.universityId);
                    return (
                      <div key={subject.id} className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center hover:shadow-2xl transition duration-300">
                        <div className="flex items-center gap-4">
                          <Book className="w-6 h-6 text-blue-600" />
                          <div>
                            <div className="text-xl font-semibold">{subject.name}</div>
                            <div className="text-gray-700">
                              <GraduationCap className="w-4 h-4 text-green-600 inline-block mr-2" />
                              {faculty?.name}
                            </div>
                            <div className="text-gray-700 mt-1">
                              <UniversityIcon className="w-4 h-4 text-blue-600 inline-block mr-2" />
                              {university?.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <Link to={`/sub/${subject.id}`} className="w-max-[250px] flex justify-center items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
                            <Eye className="w-5 sm:w-6 h-5 sm:h-6 mr-2" /> Преглед
                          </Link>
                          <Link to={`/sub/${subject.id}`} className="w-max-[250px] flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
                            <Edit className="w-5 sm:w-6 h-5 sm:h-6 mr-2" /> Измена
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

export default SubjectHome;
