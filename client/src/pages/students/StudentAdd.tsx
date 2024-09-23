import { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { useGetUnisByServiceWhereUserIdQuery } from '../../store/api/serviceSlice';
import { useGetStudentsOnFacultiesQuery, useAddStudentToFacultyMutation } from '../../store/api/facultySlice';
import { useGetUsersByRoleQuery } from '../../store/api/userSlice';
import Select from 'react-select';
import Button from '../../components/ui/Button';
import FormContainer from '../../components/containers/Form';
import MainLayout from '../../components/layouts/MainLayout';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type Department = {
  id: number;
  name: string;
  type: string;
  facultyId: number;
};

type Faculty = {
  id: number;
  name: string;
  universityId: number;
  departments: Department[];
};

type University = {
  id: number;
  name: string;
  location: string;
  ownerId: number;
  faculties: Faculty[];
};


const StudentAdd = () => {
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.user.id);

  const [universities, setUniversities] = useState<University[] | undefined>();
  const [users, setUsers] = useState<User[] | undefined>();
  const [faculties, setFaculties] = useState<Faculty[] | undefined>();

  const [selectedUniversity, setSelectedUniversity] = useState<number | undefined>();
  const [selectedFaculty, setSelectedFaculty] = useState<number | undefined>();
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

  const { data: universitiesData, isLoading: isLoadingUniversities } = useGetUnisByServiceWhereUserIdQuery(userId);
  const { data: allUsers, isLoading: isLoadingUsers } = useGetUsersByRoleQuery('user');

  // Preuzimanje studenata koji su već na fakultetu
  const { data: studentsOnFaculties, isLoading: isLoadingStudents } = useGetStudentsOnFacultiesQuery(
    selectedFaculty?.toString() || "",
    {
      skip: !selectedFaculty,
    }
  );

  const [addStudentToFaculty] = useAddStudentToFacultyMutation();

  useEffect(() => {
    if (universitiesData?.universities && allUsers?.users) {
      setUniversities(universitiesData.universities);
      setUsers(allUsers.users);
    }
  }, [universitiesData, allUsers]);

  useEffect(() => {
    if (selectedUniversity) {
      const university = universities?.find((uni) => uni.id === selectedUniversity);
      setFaculties(university?.faculties || []);
      setSelectedStudents([]); // Resetuj izabrane studente kada se promeni univerzitet
    }
  }, [selectedUniversity, universities]);

  useEffect(() => {
    if (selectedFaculty) {
      setSelectedStudents([]); // Resetuj izabrane studente kada se promeni fakultet
    }
  }, [selectedFaculty]);

  // Proveri da li se podaci o univerzitetima i korisnicima još uvek učitavaju
  if (isLoadingUniversities || isLoadingUsers) {
    return <div>Učitavanje univerziteta i korisnika...</div>;
  }

  // Proveri da li su studenti na fakultetu učitani pre filtriranja
  const filteredStudentsOnFaculty = studentsOnFaculties?.studentsOnFaculty || [];

  // Filtriramo studente koji nisu već na fakultetu
  const availableStudents = users?.filter((user) => {
    // Ako studenti nisu učitani ili nema studenata na fakultetu, prikaži sve korisnike
    if (isLoadingStudents || !filteredStudentsOnFaculty.length) {
      return true;
    }
    // Proveravamo da li student već postoji u listi studenata na fakultetu
    return !filteredStudentsOnFaculty.some((student) => student.userId === user.id);
  }) || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (selectedStudents.length && selectedFaculty) {
        const selectedStudent = selectedStudents[0];
        await addStudentToFaculty({ facultyId: selectedFaculty, userId: selectedStudent.id }).unwrap();
        navigate('/students/');
      }
    } catch (error: any) {
      if (error.status === 403) {
        navigate('/stud/add');
      }
      console.error('Error adding students to faculty:', error);
    }
  };

  return (
    <MainLayout>
      <div className="w-full h-screen flex justify-center items-center bg-secondary-custom overflow-y-scroll py-5">
        <FormContainer>
          <form onSubmit={handleSubmit}>
            {/* Dropdown za univerzitet */}
            <div className="mb-4">
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                Изаберите универзитет
              </label>
              <select
                value={selectedUniversity || ''}
                onChange={(e) => setSelectedUniversity(parseInt(e.target.value))}
                className="w-full py-2 px-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Изаберите универзитет</option>
                {universities?.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown za fakultet */}
            {selectedUniversity && faculties && faculties.length > 0 && (
              <div className="mb-4">
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                  Изаберите факултет
                </label>
                <select
                  value={selectedFaculty || ''}
                  onChange={(e) => setSelectedFaculty(parseInt(e.target.value))}
                  className="w-full py-2 px-2 border border-gray-300 rounded-lg"
                  required
                  disabled={!faculties?.length}
                >
                  <option value="">Изаберите факултет</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Select za studente */}
            {selectedFaculty && !isLoadingStudents && availableStudents.length > 0 && (
              <div className="mb-4">
                <label htmlFor="students" className="block text-sm font-medium text-gray-700 mb-2">
                  Изаберите студента
                </label>
                <Select
                  isClearable
                  options={availableStudents.map((user) => ({
                    value: user.id,
                    label: `${user.name} (${user.username})`,
                  }))}
                  placeholder={"Изаберите студента"}
                  onChange={(selectedOption) => {
                    const selectedStudentData = users?.find(user => user.id === selectedOption?.value);
                    setSelectedStudents(selectedStudentData ? [selectedStudentData] : []);
                  }}
                />
              </div>
            )}

            {/* Submit dugme */}
            <Button type="submit" children="Додај студента на факултет" />
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  );
};

export default StudentAdd;
