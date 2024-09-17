import { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { useGetUnisByServiceWhereUserIdQuery } from '../../store/api/serviceSlice';
import { useGetProfessorsOnDepQuery, useAddProfessorToDepartmentMutation } from '../../store/api/departmentSlice';
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

// Tip za profesora na odseku
type ProfessorOnDep = {
  userId: number;
  departmentId: number;
  user: {
    id: number;
    name: string;
    username: string;
  };
};

// Tip za odgovor iz API-ja koji vraća niz profesora na odseku
type ProfessorsOnDepsResponse = {
  professorsOnDep: ProfessorOnDep[];
};


const ProfessorAdd = () => {
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.user.id);
  
  const [universities, setUniversities] = useState<University[]>();
  const [users, setUsers] = useState<User[]>();
  const [faculties, setFaculties] = useState<Faculty[]>();
  const [departments, setDepartments] = useState<Department[]>();
  
  const [selectedUniversity, setSelectedUniversity] = useState<number>();
  const [selectedFaculty, setSelectedFaculty] = useState<number>();
  const [selectedDepartment, setSelectedDepartment] = useState<number>();
  const [selectedProfessors, setSelectedProfessors] = useState<User[]>([]);

  const { data: universitiesData } = useGetUnisByServiceWhereUserIdQuery(userId);
  const { data: professorsOnDeps = { professorsOnDep: [] } as ProfessorsOnDepsResponse } = useGetProfessorsOnDepQuery(selectedDepartment || 0);

  const { data: allProfessors } = useGetUsersByRoleQuery('professor');

  const [addProfessorToDepartment] = useAddProfessorToDepartmentMutation();
  
  // Fetch universities and professors data
  useEffect(() => {
    if (universitiesData?.universities && allProfessors?.users) {
      setUniversities(universitiesData.universities);
      setUsers(allProfessors.users);
    }
  }, [universitiesData, allProfessors]);

  // Filter faculties based on selected university
  useEffect(() => {
    if (selectedUniversity) {
      const university = universities?.find((uni) => uni.id === selectedUniversity);
      setFaculties(university?.faculties || []);
      setDepartments([]);
      setSelectedProfessors([]);  // Resetuj odabrane profesore prilikom promene univerziteta
    }
  }, [selectedUniversity, universities]);

  // Filter departments based on selected faculty
  useEffect(() => {
    if (selectedFaculty) {
      const faculty = faculties?.find((fac) => fac.id === selectedFaculty);
      setDepartments(faculty?.departments || []);
      setSelectedProfessors([]);  // Resetuj odabrane profesore prilikom promene fakulteta
    }
  }, [selectedFaculty, faculties]);

  // Resetuj odabrane profesore kad god se promeni odsek
  useEffect(() => {
    setSelectedProfessors([]); // Resetuj odabrane profesore prilikom promene odseka
  }, [selectedDepartment]);

  if (!users || !professorsOnDeps.professorsOnDep) {
    return <div>Učitavanje podataka...</div>;
  }
  

  const availableProfessors = users?.filter((user) => 
    Array.isArray(professorsOnDeps.professorsOnDep) && 
    !professorsOnDeps.professorsOnDep.some((prof: ProfessorOnDep) => prof.userId === user.id)
  ) || [];
  
  // Handle form submission to assign a professor to a department
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (selectedProfessors.length && selectedDepartment) {
        const selectedProfessor = selectedProfessors[0]; // Single professor selection
        await addProfessorToDepartment({ depId: selectedDepartment, userId: selectedProfessor.id });
        navigate('/professors/');
      }
    } catch (error) {
      console.error('Error adding professors to department:', error);
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
                {faculties?.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown za odsek */}
            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Изаберите одсек
              </label>
              <select
                value={selectedDepartment || ''}
                onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
                className="w-full py-2 px-2 border border-gray-300 rounded-lg"
                required
                disabled={!departments?.length}
              >
                <option value="">Изаберите одсек</option>
                {departments?.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name} - {department.type} студије
                  </option>
                ))}
              </select>
            </div>

            {/* Select za profesore */}
            <div className="mb-4">
              <label htmlFor="professors" className="block text-sm font-medium text-gray-700 mb-2">
                Изаберите професора
              </label>
              <Select
                options={availableProfessors.map((user) => ({
                  value: user.id,
                  label: `${user.name} (${user.username})`,
                }))}
                placeholder={"Изаберите професора"}
                onChange={(selectedOption) => {
                  const selectedProfessorData = users?.find(user => user.id === selectedOption?.value);
                  setSelectedProfessors(selectedProfessorData ? [selectedProfessorData] : []);
                }}
              />
            </div>

            {/* Submit dugme */}
            <Button type="submit" children="Додај професора на одсек" />
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  );
};

export default ProfessorAdd;
