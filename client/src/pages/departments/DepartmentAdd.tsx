import { useState } from 'react'
import MainLayout from '../../components/layouts/MainLayout'
import FormContainer from '../../components/containers/Form'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const DepartmentAdd = () => {
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDisabled(true);

    console.log({name})
    console.log({ DepartmentAdd : "Connection not finished!" });
  };

  return (
    <MainLayout>
      <div className="w-full h-screen grid place-items-center bg-secondary-custom">
        <FormContainer>
          <form method="POST" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-3">
              <Input id="university" type="text" label="Изабери Универзитет"  value={name} setValue={setName}/>
              <Input id="faculty" type="text" label="Изабери Факултет"  value={name} setValue={setName}/>
              <Input id="name" type="text" label="Назив одсека"  value={name} setValue={setName}/>
            </div>
            <Button type="submit" disabled={disabled} children="Додај Одсек" />
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  )
}

export default DepartmentAdd