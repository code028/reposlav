import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import Select from "react-select";
import FormContainer from '../../components/containers/Form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAppSelector } from '../../store/hooks';
import { Professor, Student, StudentData, useGetAllStudentsFromFacWhereProfessorWorkingQuery, useGetProfessorByIdQuery } from '../../store/api/professorSlice';
import FileUpload from '../../components/FileUpload';
import FileProgress from '../../components/FileProgress';

type StudentInfo = {
  id: number;
  name: string;
  email: string;
  universityId: number;
  university: string;
  facultyId: number;
  faculty: string;
};

const WorkAdd = () => {
  const { id: professorId } = useAppSelector(state => state.user);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [professor, setProfessor] = useState<Professor>();
  const [students, setStudents] = useState<StudentData[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<StudentInfo>();
  const [thesisName, setThesisName] = useState<String>("");
  const [selectedStudieLevel, setSelectedStudieLevel] = useState<Student>();
  const [indexNumber, setIndexNumber] = useState<String>("");
  const [uploadedFiles, setUploadedFiles] = useState<FileWithProgress[]>([]);

  const { data: professorData } = useGetProfessorByIdQuery(professorId);
  const { data: studentsData } = useGetAllStudentsFromFacWhereProfessorWorkingQuery(professorId);

  // Ucitavanje profesora
  useEffect(() => {
    if (professorData) {
      setProfessor(professorData[0]);
    }
  }, [professorData]);

  // Ucitavanje Studenata
  useEffect(() => {
    if (studentsData) {
      setStudents(studentsData);
    }
  }, [studentsData]);

  // Filtriranje studenata za React Select
  const studentOptions: StudentInfo[] = students
    .slice()
    .sort((a: StudentData, b: StudentData) => a.student.name.localeCompare(b.student.name))
    .map(student => ({
      id: student.student.id,
      name: student.student.name,
      email: student.student.email,
      universityId: student.university.id,
      university: student.university.name,
      facultyId: student.faculty.id,
      faculty: student.faculty.name
    }));

  const studieLevelOptions = [
    { value: "diplomski", label: "Дипломски рад" },
    { value: "masterRad", label: "Мастер рад" },
  ]

  type FileWithProgress = {
    file: File;
    progress: number;
    isUploading: boolean;
  };

  // Funkcija koja simulira upload fajlova
  const simulateFileUpload = (newFiles: FileWithProgress[]) => {
    setUploadedFiles((prevFiles) => {
      // Dodaj nove fajlove u postojeći niz fajlova
      const updatedFiles = [...prevFiles, ...newFiles];

      updatedFiles.forEach((fileWithProgress, index) => {
        if (fileWithProgress.isUploading) {
          const interval = setInterval(() => {
            setUploadedFiles((prevFiles) => {
              const filesCopy = [...prevFiles];

              // Proveri da li fajl postoji pre nego što ažuriraš progress
              if (!filesCopy[index]) {
                clearInterval(interval);
                return filesCopy;
              }

              if (filesCopy[index].progress < 100) {
                filesCopy[index].progress += 10;
              } else {
                clearInterval(interval);
                filesCopy[index].isUploading = false; // Upload završen
              }

              return filesCopy;
            });
          }, 300);
        }
      });
      return updatedFiles;
    });
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleCancelFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Proveravanje svih neophodnih podataka
  useEffect(() => {
    const isFormValid =
      selectedStudent !== null &&
      selectedStudieLevel !== null &&
      thesisName.trim().length > 0 &&
      indexNumber.trim().length > 0 &&
      uploadedFiles.length > 0 &&
      uploadedFiles.every(file => file.progress === 100);

    setDisabled(!isFormValid);
  }, [selectedStudent, selectedStudieLevel, thesisName, indexNumber, uploadedFiles]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDisabled(true);
    console.log({ professor, selectedStudent, thesisName, uploadedFiles });
    setDisabled(false);
  };

  return (
    <MainLayout>
      <div className='w-full h-screen min-h-screen bg-secondary-custom sm:py-5 py-0 md:p-10 flex flex-col items-center overflow-y-scroll'>
        <FormContainer className='bg-bg-l-primary md:w-10/12 lg:w-10/12 xl:w-8/12'>
          <form method="POST" onSubmit={handleFormSubmit}>
            <div className="w-full flex flex-col gap-y-3">
              <Input id="professorName" type="text" label="Име професора" value={professor?.name} className='text-gray-600 font-semibold ' disabled />
              <Input id="professorEmail" type="text" label="Е-пошта професора" value={professor?.email} className='text-gray-600 font-semibold' disabled />
              {studentOptions &&
                <div>
                  <label htmlFor="professorSelect" className="text-[#9e9e9e] text-sm font-semibold">
                    Изаберите студента
                  </label>
                  <Select
                    id="studentSelect"
                    isClearable
                    value={selectedStudent}
                    // @ts-ignore
                    onChange={(selectedOption) => setSelectedStudent(selectedOption)}
                    options={studentOptions}
                    getOptionLabel={(option) => `${option.name} - [${option.faculty}] - ${option.email}`}
                    getOptionValue={(option) => String(option.id)}
                    className="mt-1"
                    placeholder="Изаберите студента"
                    required
                  />
                </div>
              }
              {studieLevelOptions &&
                <div>
                  <label htmlFor="professorSelect" className="text-[#9e9e9e] text-sm font-semibold">
                    Изаберите тип рада
                  </label>
                  <Select
                    id="studieLevelSelect"
                    isClearable
                    // @ts-ignore
                    options={studieLevelOptions}
                    value={selectedStudieLevel}
                    // @ts-ignore
                    onChange={(selectedOption) => setSelectedStudieLevel(selectedOption)}
                    className="mt-1"
                    placeholder="Изаберите тип рада"
                    required
                  />
                </div>
              }
              <Input id="studentIndexNumber" type="text" label="Број индекса студента" value={indexNumber} setValue={setIndexNumber} />
              <Input id="thesisName" type="text" label="Наслов теме" value={thesisName} setValue={setThesisName} />
            </div>
            <div className='flex flex-col gap-5 py-5'>
              <FileUpload onFileUpload={simulateFileUpload} onCancelFile={handleCancelFile} />
              <div className='grid sm:grid-cols-1 lg:grid-cols-2 gap-2 px-5'>
                {uploadedFiles.map((fileWithProgress, index) => (
                  <FileProgress
                    key={index}
                    fileWithProgress={fileWithProgress}
                    onCancel={() => handleCancelFile(index)}
                    onDelete={() => handleDeleteFile(index)}
                  />
                ))}
              </div>
            </div>
            <Button type="submit" disabled={disabled} children="Додај рад" />
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  );
};

export default WorkAdd;
