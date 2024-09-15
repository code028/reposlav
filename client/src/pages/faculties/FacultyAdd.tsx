import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/layouts/MainLayout'
import FormContainer from '../../components/containers/Form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const FacultyAdd = () => {
  const [university, setUniversity] = useState("");
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(false);

  const {id} = useParams();

  useEffect(()=>{setUniversity(id!)},[])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDisabled(true);

    console.log({university,name})
    console.log({ FacultyAdd : "Connection not finished!" });
  };

  return (
    <MainLayout>
      <div className="w-full h-screen grid place-items-center bg-secondary-custom">
        <FormContainer className='bg-gray-300 bg-opacity-50'>
          <form method="POST" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-3">
              <Input id="university" type="text" label="Назив Универзитета" disabled  value={university} setValue={setUniversity} className='text-gray-500'/>
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