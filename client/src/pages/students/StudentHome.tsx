import { useState, useEffect } from 'react';
import { Search, Eye, GraduationCap, UniversityIcon, Plus, User, School, X } from 'lucide-react';
import MainLayout from '../../components/layouts/MainLayout';
import { useAppSelector } from '../../store/hooks';
import { Link } from 'react-router-dom';
import { useGetStudentsOnFacsWhereServiceHasUserWithIdQuery } from '../../store/api/facultySlice';

type StudentGrouped = {
  userId: number;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  faculties: {
    facultyId: number;
    facultyName: string;
    universityName: string;
    universityId: number;
  }[];
};

const StudentHome = () => {
  const { id: serviceId } = useAppSelector((state) => state.user);
  const { data: universitiesData } = useGetStudentsOnFacsWhereServiceHasUserWithIdQuery(serviceId);

  const [faculties, setFaculties] = useState<any[]>([]);
  const [students, setStudents] = useState<StudentGrouped[]>([]); // Dodali smo StudentGrouped tip
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);

  // Load faculties and students when data is available
  useEffect(() => {
    if (universitiesData?.faculties) {
      const allFaculties = universitiesData.faculties;
      setFaculties(allFaculties);

      const allStudents = allFaculties.flatMap((faculty) =>
        faculty.students.map((studentOnFaculty) => ({
          ...studentOnFaculty,
          facultyName: faculty.name,
          facultyId: faculty.id,
          universityName: faculty.university.name,
          universityId: faculty.university.id,
        }))
      );

      // Group students by unique userId
      const groupedStudents = allStudents.reduce<StudentGrouped[]>((acc, student) => {
        const existingStudent = acc.find((s) => s.userId === student.userId);
        if (existingStudent) {
          // Ako student već postoji, dodaj fakultet i univerzitet
          existingStudent.faculties.push({
            facultyId: student.facultyId,
            facultyName: student.facultyName,
            universityName: student.universityName,
            universityId: student.universityId,
          });
        } else {
          // Dodaj novog studenta sa prvim fakultetom i univerzitetom
          acc.push({
            userId: student.userId,
            user: student.user,
            faculties: [{
              facultyId: student.facultyId,
              facultyName: student.facultyName,
              universityName: student.universityName,
              universityId: student.universityId,
            }],
          });
        }
        return acc;
      }, []);

      setStudents(groupedStudents);
    }
  }, [universitiesData]);

  // Filter students based on search, faculty, and university
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Provera da li fakulteti studenta odgovaraju selektovanim filterima
    const matchesFaculty = selectedFaculty ? student.faculties.some((fac: any) => fac.facultyId === selectedFaculty) : true;
    const matchesUniversity = selectedUniversity ? student.faculties.some((fac: any) => fac.universityId === selectedUniversity) : true;

    return matchesSearch && matchesFaculty && matchesUniversity;
  });

  const filteredFaculties = selectedUniversity
    ? faculties.filter((faculty) => faculty.university.id === selectedUniversity)
    : faculties;

  return (
    <MainLayout>
      <div className="w-full h-screen min-h-screen bg-secondary-custom p-6 flex flex-col items-center overflow-y-scroll">
        <div className="w-full max-w-7xl">
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-6">
            <div className="text-3xl font-bold flex items-center gap-5 text-center md:text-left mb-4 md:mb-0">
              <User className="w-8 h-8 text-blue-600" />
              Сви студенти
            </div>
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Претражите студенте"
                className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='w-full flex gap-2 justify-end pb-2'>
            <Link to={'/register/student'} className="w-full sm:w-fit flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
              <Plus className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
              Региструј студента
            </Link>
            <Link to={'/stud/add'} className="w-full sm:w-fit flex items-center px-3 sm:px-4 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg shadow-lg transition duration-200">
              <Plus className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
              Додај студента
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
                .map((faculty) => faculty.university.id)
                .filter((uniId, index, self) => self.indexOf(uniId) === index)
                .map((universityId) => {
                  const university = universitiesData?.faculties.find((u) => u.university.id === universityId)?.university;
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

          {/* Prikaz studenata */}
          <div className="py-6">
            {filteredStudents.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Сви студенти</h2>
                <div className="flex flex-col gap-4">
                  {filteredStudents.map((studentOnFaculty: any) => {
                    const uniqueUniversities = new Set(studentOnFaculty.faculties.map((faculty: any) => faculty.universityName));
                    return (
                      <div key={studentOnFaculty.user.id} className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center hover:shadow-xl transition duration-300">
                        <div className="flex items-center gap-4">
                          <GraduationCap className="w-8 h-8 text-blue-600" />
                          <div>
                            <div className="text-lg font-semibold">{studentOnFaculty.user.name}</div>
                            <div className="text-gray-500 text-sm">@{studentOnFaculty.user.username}</div>
                            <div className="flex flex-col mt-2 gap-1">
                              <span className="text-gray-600 text-sm flex items-center gap-1">
                                <UniversityIcon className="w-4 h-4 text-blue-500" /> {uniqueUniversities.size} универзитет
                              </span>
                              <span className="text-gray-600 text-sm flex items-center gap-1">
                                <School className="w-4 h-4 text-green-500" /> {studentOnFaculty.faculties.length} факултет
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Link to={`/stud/${studentOnFaculty.user.id}`} className="flex gap-x-3 items-center px-3 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg shadow transition duration-200">
                            <Eye className="w-5 h-5" /> <div>Преглед</div>
                          </Link>
                          {/* <Link to={`/stud/${studentOnFaculty.user.id}/edit`} className="flex gap-x-3 items-center px-3 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg shadow transition duration-200">
                            <X className="w-5 h-5" /> Обриши
                          </Link> */}
                          <button className="flex gap-x-3 items-center px-3 py-2 bg-black bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg shadow transition duration-200">
                            <X className="w-5 h-5" /> Обриши
                          </button>
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

export default StudentHome;
