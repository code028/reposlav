import { useEffect, useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import FormContainer from '../../components/containers/Form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Faculty, University } from '../../store/types/university';
import { useAppSelector } from '../../store/hooks';
import { useGetUnisByOwnerForServiceQuery } from '../../store/api/universitySlice';
import { useAddServiceMutation } from '../../store/api/serviceSlice';
import { useNavigate } from 'react-router-dom';

const ServiceAdd = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<University[]>();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [name, setName] = useState('');
  const [disabled, setDisabled] = useState(false);

  const userId = useAppSelector((state) => state.user.id);
  const userRole = useAppSelector((state) => state.user.role);

  // Fetch data based on user role
  const { data: uniData } = useGetUnisByOwnerForServiceQuery(userId, {skip: userRole !== 'admin'});

  const [addService] = useAddServiceMutation();

  // Load data based on role
  useEffect(() => {
    if (userRole === 'admin' && uniData?.universities) {
      setUniversities(uniData.universities);
    } 
  }, [uniData, userRole]);

  // Handle university change and filter faculties
  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = parseInt(e.target.value);
    const selectedUni = universities?.find((uni) => uni.id === universityId) || null;
    setSelectedUniversity(selectedUni);

    if (selectedUni) {
      setFaculties(selectedUni.faculties || []);
    } else {
      setFaculties([]);
    }
  };

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const facultyId = parseInt(e.target.value);
    const selectedFac = faculties.find((fac) => parseInt(fac.id) === facultyId) || null;
    setSelectedFaculty(selectedFac);
  };

  // Handle submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDisabled(true);

    try {
      await addService({facultyId: selectedFaculty?.id, name}).unwrap();
      setDisabled(false);
      navigate(`/services/`);
    } catch (error) {
      console.error(error);
      setDisabled(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full h-screen grid place-items-center bg-secondary-custom overflow-y-scroll">
        <FormContainer>
          <form method="POST" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-4">
              {/* Dropdown za univerzitete */}
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  Изаберите универзитет
                </label>
                <select
                  id="university"
                  className="overflow-y-scroll w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedUniversity?.id || ''}
                  onChange={handleUniversityChange}
                  required
                >
                  <option value="" disabled hidden>Изаберите универзитет</option>
                  {universities?.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown za fakultete */}
              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                  Изаберите факултет
                </label>
                <select
                  id="faculty"
                  className="overflow-y-scroll w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedFaculty?.id || ''}
                  onChange={handleFacultyChange}
                  required
                  disabled={!faculties.length} // Onemogućavamo dropdown ako nema fakulteta
                >
                  <option value="" disabled hidden>Изаберите факултет</option>
                  {faculties.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input za naziv sluzbu */}
              <Input id="name" type="text" label="Назив службе" value={name} setValue={setName} />

              {/* Submit dugme */}
              <Button type="submit" disabled={disabled}>
                Додај службу
              </Button>
            </div>
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  );
};

export default ServiceAdd;
