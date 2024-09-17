import { useState, useEffect } from 'react';
import { Subject, useAddSubjectMutation } from '../../store/api/subjectSlice';
import { useAppSelector } from '../../store/hooks';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useGetUnisByServiceWhereUserIdQuery } from '../../store/api/serviceSlice';
import { useAddSubjectToDepartmentMutation } from '../../store/api/departmentSlice';
import FormContainer from '../../components/containers/Form';
import MainLayout from '../../components/layouts/MainLayout';
import { useNavigate } from 'react-router-dom';

export type UniversityResponse = {
  universities: University[];
};

type University = {
  id: number;
  name: string;
  location: string;
  ownerId: number;
  faculties: Faculty[];
};

type Faculty = {
  id: number;
  name: string;
  universityId: number;
  service: Service;
  departments: Department[];
};

type Service = {
  id: number;
  name: string;
  facultyId: number;
};

type Department = {
  id: number;
  name: string;
  type: 'osnovne' | 'master';
  facultyId: number;
};


const SubjectAdd = () => {
  const navigate =  useNavigate();
  const userId = useAppSelector((state) => state.user.id);
  const { data: universitiesData } = useGetUnisByServiceWhereUserIdQuery(userId); // Dobijanje univerziteta

  const [addSubject] = useAddSubjectMutation(); // Funkcija za dodavanje predmeta
  const [addSubjectToDepartment] = useAddSubjectToDepartmentMutation(); // Funkcija za vezivanje predmeta za odsek

  const [universities, setUniversities] = useState<University[]>();
  const [faculties, setFaculties] = useState<Faculty[]>();
  const [departments, setDepartments] = useState<Department[]>();
  
  // Izabrani podaci
  const [selectedUniversity, setSelectedUniversity] = useState<number>();
  const [selectedFaculty, setSelectedFaculty] = useState<number>();
  const [selectedDepartment, setSelectedDepartment] = useState<number>();
  
  // Podaci o predmetu
  const [subjectName, setSubjectName] = useState('');
  const [espbPoints, setEspbPoints] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectDescription, setSubjectDescription] = useState('');

  useEffect(() => {
    if (universitiesData?.universities) {
      setUniversities(universitiesData.universities);
    }
  }, [universitiesData]);

  // Kada se promeni univerzitet, filtriramo fakultete
  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = parseInt(e.target.value);
    setSelectedUniversity(universityId);

    const university = universities?.find((uni: University) => uni.id === universityId);
    if (university) {
      setFaculties(university.faculties);
      setDepartments([]);
    } else {
      setFaculties([]);
      setDepartments([]);
    }
  };

  // Kada se promeni fakultet, filtriramo odseke
  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const facultyId = parseInt(e.target.value);
    setSelectedFaculty(facultyId);

    const faculty = faculties?.find((fac: Faculty) => fac.id === facultyId);
    if (faculty) {
      setDepartments(faculty.departments);
    } else {
      setDepartments([]);
    }
  };
  // Dodavanje predmeta i vezivanje za odsek
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const subject: Subject  = await addSubject({
        name: subjectName,
        espb: parseInt(espbPoints),
        code: subjectCode,
        description: subjectDescription,
      }).unwrap();

      if (selectedDepartment && subject) { 
        await addSubjectToDepartment({ subjectId: subject.subject.id, departmentId: selectedDepartment.toString()});
      }
      navigate('/subjects/');
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  return (
    <MainLayout>
      <div className="w-full h-screen flex justify-center items-center bg-secondary-custom overflow-y-scroll py-5">
        <FormContainer>
          <form onSubmit={handleSubmit} className="">

            {/* Dropdown za univerzitet */}
            <div className="mb-4">
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                Изаберите универзитет
              </label>
              <select
                value={selectedUniversity || ''}
                onChange={handleUniversityChange}
                className="overflow-y-scroll w-full py-2 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Изаберите универзитет</option>
                {universities?.map((university: any) => (
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
                onChange={handleFacultyChange}
                className="overflow-y-scroll w-full py-2 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!faculties?.length}
              >
                <option value="">Изаберите факултет</option>
                {faculties?.map((faculty: Faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown za odsek */}
            <div className="mb-4">
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                  Изаберите одсек
                </label>
              <select
                value={selectedDepartment || ''}
                onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
                className="overflow-y-scroll w-full py-2 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!departments?.length}
              >
                <option value="">Изаберите одсек</option>
                {departments?.map((department: any) => (
                  <option key={department.id} value={department.id}>
                    {department.name} - {department.type} студије
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col gap-y-2'>
              {/* Input za naziv predmeta */}
              <Input
                id="subject-name"
                type="text"
                label="Име предмета"
                value={subjectName}
                setValue={setSubjectName}
              />

              {/* Input za broj ESPB poena */}
              <Input
                id="subject-name"
                type="number"
                label="Број еспб бодова"
                value={espbPoints}
                setValue={setEspbPoints}
              />
              
              {/* Input za šifru predmeta */}
              <Input
                id="subject-code"
                type="text"
                label="Шифра предмета"
                value={subjectCode}
                setValue={setSubjectCode}
              />
            </div>

            {/* Textarea za opis predmeta */}
            <div className="py-2">
              <label className="block text-gray-700">Опис предмета</label>
              <textarea
                value={subjectDescription}
                onChange={(e) => setSubjectDescription(e.target.value)}
                className="w-full mt-2 p-2 border rounded-lg"
                rows={4}
              />
            </div>

            {/* Submit dugme */}
            <Button type="submit" children="Додај предмет на одсек" />
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  );
};

export default SubjectAdd;
