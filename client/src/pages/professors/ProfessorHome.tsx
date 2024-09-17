import { useEffect, useState } from 'react';
import { Search, Eye, Edit, GraduationCap, UniversityIcon, Plus, User, School, Building2 } from 'lucide-react';
import MainLayout from '../../components/layouts/MainLayout';
import { useAppSelector } from '../../store/hooks';
import { Link } from 'react-router-dom';
import { useGetDepsOnFacsWhereServiceHasUserWithIdQuery } from '../../store/api/subjectSlice';
import { useGetAllProfessorsOnDepsQuery } from '../../store/api/departmentSlice';

type Faculty = {
  id: number;
  name: string;
  universityId: number;
  departments: Department[];
};

type University = {
  id: number;
  name: string;
  faculties: Faculty[];
};

type Department = {
  id: number;
  facultyId: number;
};

type ProfessorOnDepartment = {
  userId: number;
  departmentId: number;
  user: {
    id: number;
    name: string;
    username: string;
  };
};

const ProfessorHome = () => {
  const serviceId = useAppSelector((state) => state.user.id);

  const { data: universitiesData } = useGetDepsOnFacsWhereServiceHasUserWithIdQuery(serviceId);
  const { data: professorsOnDepartmentsData } = useGetAllProfessorsOnDepsQuery();

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [professors, setProfessors] = useState<ProfessorOnDepartment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);

  useEffect(() => {
    if (universitiesData?.universities) {
      const allFaculties = universitiesData.universities.flatMap((university: University) => university.faculties);
      setFaculties(allFaculties);

      const allProfessors = professorsOnDepartmentsData || [];
      setProfessors(allProfessors);
    }
  }, [universitiesData, professorsOnDepartmentsData]);

  const groupedProfessors = professors.reduce((acc: any, curr: ProfessorOnDepartment) => {
    const existingProfessor = acc.find((p: any) => p.userId === curr.userId);
    if (existingProfessor) {
      existingProfessor.departments.push(curr.departmentId);
    } else {
      acc.push({ ...curr, departments: [curr.departmentId] });
    }
    return acc;
  }, []);

  const filteredProfessors = groupedProfessors.filter((professorOnDepartment: any) => {
    const department = universitiesData?.universities
      .flatMap((university: University) => university.faculties.flatMap(fac => fac.departments))
      .find(dep => dep.id === professorOnDepartment.departmentId);

    const faculty = faculties.find(fac => fac.id === department?.facultyId);

    const matchesSearch = professorOnDepartment.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = selectedFaculty ? department?.facultyId === selectedFaculty : true;
    const matchesUniversity = selectedUniversity ? faculty?.universityId === selectedUniversity : true;

    return matchesSearch && matchesFaculty && matchesUniversity;
  });

  const filteredFaculties = selectedUniversity
    ? faculties.filter((faculty) => faculty.universityId === selectedUniversity)
    : faculties;

  return (
    <MainLayout>
      <div className="w-full h-screen min-h-screen bg-secondary-custom p-6 flex flex-col items-center overflow-y-scroll">
        <div className="w-full max-w-7xl">
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-6">
            <div className="text-3xl font-bold flex items-center gap-5 text-center md:text-left mb-4 md:mb-0">
              <User className="w-8 h-8 text-blue-600" />
              Сви професори
            </div>
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Претражите професоре"
                className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='w-full flex gap-2 justify-end pb-2'>
            <Link to={'/register/professor'} className="w-full sm:w-fit flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
              <Plus className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
              Региструј професора
            </Link>
            <Link to={'/prof/add'} className="w-full sm:w-fit flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
              <Plus className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
              Додај Професора
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
                setSelectedFaculty(null); 
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
          </div>

          {/* Prikaz profesora */}
          <div className="py-6">
            {filteredProfessors.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Сви професори</h2>
                <div className="flex flex-col gap-4">
                  {filteredProfessors.map((professorOnDepartment: any) => {
                    const departments = faculties.flatMap(fac => fac.departments).filter(dep => professorOnDepartment.departments.includes(dep.id));
                    const facultiesForProfessor = faculties.filter(fac => departments.some(dep => dep.facultyId === fac.id));
                    const universitiesForProfessor = universitiesData?.universities.filter(uni => facultiesForProfessor.some(fac => fac.universityId === uni.id));

                    return (
                      <div key={professorOnDepartment.user.id} className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center hover:shadow-xl transition duration-300">
                        <div className="flex items-center gap-4">
                          <GraduationCap className="w-8 h-8 text-blue-600" />
                          <div>
                            <div className="text-lg font-semibold">{professorOnDepartment.user.name}</div>
                            <div className="text-gray-500 text-sm">@{professorOnDepartment.user.username}</div>
                            <div className="flex gap-2 mt-2">
                              <span className="text-gray-600 text-sm flex items-center gap-1">
                                <UniversityIcon className="w-4 h-4 text-blue-500" /> {universitiesForProfessor?.length} универзитета
                              </span>
                              <span className="text-gray-600 text-sm flex items-center gap-1">
                                <School className="w-4 h-4 text-green-500" /> {facultiesForProfessor.length} факултета
                              </span>
                              <span className="text-gray-600 text-sm flex items-center gap-1">
                                <Building2 className="w-4 h-4 text-yellow-500" /> {departments.length} одсека
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Link to={`/prof/${professorOnDepartment.user.id}`} className="flex gap-x-3 items-center px-3 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg shadow transition duration-200">
                            <Eye className="w-5 h-5" /> <div>Преглед</div>
                          </Link>
                          <Link to={`/prof/${professorOnDepartment.user.id}/edit`} className="flex gap-x-3 items-center px-3 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg shadow transition duration-200">
                            <Edit className="w-5 h-5" /> Измена
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

export default ProfessorHome;
