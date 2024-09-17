import { useEffect, useState } from 'react'
import MainLayout from '../../components/layouts/MainLayout'
import FormContainer from '../../components/containers/Form'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetUniByIdQuery } from '../../store/api/universitySlice'
import { Department, University } from '../../store/types/university'
import { useGetFacByIdQuery } from '../../store/api/facultySlice'
import { useAddDepartmentMutation } from '../../store/api/departmentSlice'

const DepartmentAdd = () => {
  const navigate = useNavigate();
  const [university, setUniversity] = useState<University>()
  const [faculty, setFaculty] = useState<Department>()
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [disabled, setDisabled] = useState(false);

  const {uniId, facId} = useParams();

  const {data: uniData} = useGetUniByIdQuery(uniId!);
  const {data: facData} = useGetFacByIdQuery(facId!);
  const [addDep] = useAddDepartmentMutation()

  useEffect(() => {
    if(uniData && facData){
      setUniversity(uniData.university);
      setFaculty(facData);
    }
  }, [uniData, facData])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDisabled(true);
    await addDep({id:parseInt(facId!), name, type}).unwrap();
    navigate(`/uni/${uniId}/fac/${facId}`)
  };

  return (
    <MainLayout>
      <div className="w-full h-screen grid place-items-center bg-secondary-custom">
        <FormContainer>
          <form method="POST" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-1">
              <Input id="university" type="text" label="Изабери Универзитет" disabled value={university?.name} />
              <Input id="faculty" type="text" label="Изабери Факултет" disabled value={faculty?.name}/>
              <Input id="name" type="text" label="Назив одсека"  value={name} setValue={setName}/>
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  Изаберите тип одсека
                </label>
                <select
                  id="type"
                  className="overflow-y-scroll w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={type}
                  onChange={(e) => setType(e.currentTarget.value)}
                  required
                >
                  <option value="" disabled hidden>Изаберите тип студија</option>
                  <option key={"osnovne"} value={'osnovne'}>
                    Основне студије
                  </option>
                  <option key={"master"} value={'master'}>
                    Мастер студије
                  </option>
                </select>
              </div>
            </div>
            <Button type="submit" disabled={disabled} children="Додај Одсек" />
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  )
}

export default DepartmentAdd