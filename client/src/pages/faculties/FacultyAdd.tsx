import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layouts/MainLayout'
import FormContainer from '../../components/containers/Form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useGetUniByIdQuery } from '../../store/api/universitySlice';
import { University } from '../../store/types/university';
import { useAddFacultyMutation } from '../../store/api/facultySlice';

const FacultyAdd = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [university, setUniversity] = useState<University>();
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(false);

  const {id} = useParams();

  const {data} = useGetUniByIdQuery(id!);
  const [addFaculty] = useAddFacultyMutation();

  useEffect(()=>{setUniversity(data?.university)},[data?.university])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDisabled(true);

    await addFaculty({id: parseInt(id!),name: name}).unwrap();
    setDisabled(false);
    navigate(`/uni/${id}`);
  };

  return (
    <MainLayout>
      <div className="w-full h-screen grid place-items-center bg-secondary-custom">
        <FormContainer className='bg-gray-300 bg-opacity-50'>
          <form method="POST" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-3">
              <Input id="university" type="text" label="Назив Универзитета" disabled  value={data?.university.name} setValue={setUniversity} className='text-gray-500'/>
              <Input id="name" type="text" label="Назив факултета"  value={name} setValue={setName}/>
            </div>
            <Button type="submit" disabled={disabled} children="Додај факултет" />
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  )
}

export default FacultyAdd