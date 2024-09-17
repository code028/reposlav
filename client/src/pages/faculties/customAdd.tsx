import { useEffect, useState } from 'react'
import MainLayout from '../../components/layouts/MainLayout'
import { useGetUnisByOwnerQuery } from '../../store/api/universitySlice'
import { useAppSelector } from '../../store/hooks'
import { University } from '../../store/types/university'
import FormContainer from '../../components/containers/Form'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAddFacultyMutation } from '../../store/api/facultySlice'
import { useNavigate } from 'react-router-dom'

const CustomFacultyAdd = () => {
    const navigate = useNavigate();
    const [universities, setUniversities] = useState<University[]>();
    const [selectedUniversity, setSelectedUniversity] = useState<University>();
    const [name, setName] = useState<string>();
    const [disabled, setDisabled] = useState(false);

    const ownerId = useAppSelector((state) => state.user.id);
    const {data: unis} = useGetUnisByOwnerQuery(ownerId);
    
    const [addFaculty] = useAddFacultyMutation();

    useEffect(() => {
        if(unis?.universities){
            setUniversities(unis.universities);
        }
    }, [unis]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDisabled(true)
        try {
            if (selectedUniversity && name) {
                await addFaculty({ id: selectedUniversity.id, name }).unwrap();
                setDisabled(false);
            }
            navigate('/faculties/');
        } catch (error) {
            console.log(error);
            setDisabled(false)
        }
    }

    const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const universityId = parseInt(e.target.value);
        const university = universities?.find((uni) => uni.id === universityId) || null;
        setSelectedUniversity(university!);
    };

    return (
        <MainLayout >
            <div className='w-full h-screen flex justify-center items-center bg-secondary-custom overflow-y-scroll'>
            <FormContainer className='bg-gray-300 bg-opacity-50'>
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col gap-y-3">
                    {/* Dropdown menu za univerzitete */}
                    <div className="mb-4">
                                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                                    Изаберите универзитет
                                </label>
                                <select
                                    id="university"
                                    className="block w-full px-4 py-2 border overflow-y-scroll border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
                    <Input id="name" type="text" label="Назив факултета"  value={name} setValue={setName}/>
                    </div>
                    <Button type="submit" disabled={disabled} children="Додај факултет" />
                </form>
            </FormContainer>
            </div>
        </MainLayout>
    )
}

export default CustomFacultyAdd