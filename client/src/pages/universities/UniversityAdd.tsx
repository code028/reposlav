import { useState } from 'react'
import MainLayout from '../../components/layouts/MainLayout'
import FormContainer from '../../components/containers/Form'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAddUniversityMutation } from '../../store/api/universitySlice'
import { useAppSelector } from '../../store/hooks'
import { useNavigate } from 'react-router-dom'

const UniversityAdd = () => {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [disabled, setDisabled] = useState(false);
  const userId = useAppSelector((state) => state.user.id);

  const [addUni] = useAddUniversityMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDisabled(true);
    try {
      const data = await addUni({ userId, name, location }).unwrap();

      setDisabled(false);
      navigate('/universities');

    } catch (error) {
      console.error("University add failed", error);
      setDisabled(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full h-screen grid place-items-center bg-secondary-custom">
        <FormContainer>
          <form method="POST" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-3">
              <Input id="name" type="text" label="Назив универзитета"  value={name} setValue={setName}/>
              <Input id="location" type="text" label="Локација универзитета"  value={location} setValue={setLocation} />
            </div>
            <Button type="submit" disabled={disabled} children="Додај универзитет" />
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  )
}

export default UniversityAdd