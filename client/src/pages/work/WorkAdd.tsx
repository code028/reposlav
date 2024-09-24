import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import Select from "react-select";
import FormContainer from '../../components/containers/Form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAppSelector } from '../../store/hooks';
import { Professor, StudentData, useGetAllStudentsFromFacWhereProfessorWorkingQuery, useGetProfessorByIdQuery } from '../../store/api/professorSlice';
import FileUpload from '../../components/FileUpload';
import FileProgress, { allowedExtensions } from '../../components/FileProgress';
import { useAddStudentMutation } from '../../store/api/studentSlice';
import { useAddWorkMutation } from '../../store/api/workSlice';
import { FileDataReq, useAddFileMutation } from '../../store/api/fileSlice';
import { useNavigate } from 'react-router-dom';

type StudentInfo = {
  id: number;
  name: string;
  username: string,
  email: string;
  universityId: number;
  university: string;
  facultyId: number;
  faculty: string;
};

const workGradeOptions = [
  { value: 6, label: "6 - Шест" },
  { value: 7, label: "7 - Седам" },
  { value: 8, label: "8 - Осам" },
  { value: 9, label: "9 - Девет" },
  { value: 10, label: "10 - Десет" },
]

const WorkAdd = () => {
  const navigate = useNavigate();
  const { id: professorId } = useAppSelector(state => state.user);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [professor, setProfessor] = useState<Professor>();
  const [students, setStudents] = useState<StudentData[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<StudentInfo>();
  const [workName, setWorkName] = useState<string>("");
  const [workType, setWorkType] = useState<string>("");
  const [studentIndexNumber, setStudentIndexNumber] = useState<string>("");
  const [workGrade, setWorkGrade] = useState<number>();
  const [uploadedFiles, setUploadedFiles] = useState<FileWithProgress[]>([]);

  const formData = new FormData();

  const { data: professorData } = useGetProfessorByIdQuery(professorId);
  const { data: studentsData } = useGetAllStudentsFromFacWhereProfessorWorkingQuery(professorId);

  // Dodavanje studenta
  const [addStudent, {isLoading: studentAddLoading}] = useAddStudentMutation();
  // Dodavanje rada
  const [addWork, {isLoading: workAddLoading}] = useAddWorkMutation();
  // Dodavanje fajla
  const [addFile, {isLoading: fileAddLoading}] = useAddFileMutation();

  // Onemogucavamo formu dok se obradjuje zahtev forme
  useEffect(() => {
    if(studentAddLoading || workAddLoading || fileAddLoading){
      setDisabled(true)
    }
  }, [studentAddLoading, workAddLoading, fileAddLoading])

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
      username: student.student.username,
      email: student.student.email,
      universityId: student.university.id,
      university: student.university.name,
      facultyId: student.faculty.id,
      faculty: student.faculty.name
    }));

  const workTypes = [
    { value: "diplomski", label: "Дипломски рад" },
    { value: "masters", label: "Мастер рад" },
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
      workType !== null &&
      workName !== "" &&
      workGrade !== null &&
      studentIndexNumber.trim().length > 0 &&
      uploadedFiles.length > 0 &&
      uploadedFiles.every(file => file.progress === 100) &&
      uploadedFiles.filter(file => allowedExtensions.includes(file.file.type)) &&
      uploadedFiles.filter(file => file.file.type.concat(allowedExtensions.toString()));

    setDisabled(!isFormValid);
  }, [selectedStudent, workName, workType, workGrade, studentIndexNumber, uploadedFiles]);

  const getFilePath = (fileName: string): string => {
    const name = fileName.slice(0, fileName.lastIndexOf('.'));
    const extension = fileName.slice(fileName.lastIndexOf('.') + 1);
    const path = `${name}.${extension}`;
    return path;
  }; 

  const handleAddFile = async ({name, size, type, workId, path} : FileDataReq) => {
    await addFile({ name, size, type, workId, path });
  }

  // Submitanje forme
  // const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   setDisabled(true);

  //   // Dodavanje studenta
  //   const student = await addStudent({
  //     studentIdFK: selectedStudent?.id!,
  //     studentIndex: studentIndexNumber,
  //     name: selectedStudent?.name!,
  //     username: selectedStudent?.username!,
  //     email: selectedStudent?.email!,
  //     universityId: selectedStudent?.universityId!,
  //     universityName: selectedStudent?.university!,
  //     facultyId: selectedStudent?.facultyId!,
  //     facultyName: selectedStudent?.faculty!
  //   }).unwrap();
    
  //   // Dodavanje Radova
  //   const work = await addWork({
  //     studentId: student[0].id,
  //     name: workName,
  //     // @ts-ignore
  //     grade: workGrade.value,
  //     // @ts-ignore
  //     type: workType.value
  //   }).unwrap();
    
  //   const formData = new FormData();
  //   formData.append('workId', work[0].id); 
  //   formData.append('studentIdFK', student[0].id);
  //   formData.append('year', new Date().getFullYear().toString());
  //   formData.append('universityId', student[0].universityId.toString());
  //   formData.append('facultyId', student[0].facultyId.toString());

  //   // Dodavanje fajlova
  //   for(const file of uploadedFiles){
  //     formData.append('files', file.file);
  //     const { name, size, type } = file.file;
  //     // @ts-ignore
  //     const workId = work[0].id;
  //     const year = new Date().getFullYear();
      
  //     const filePath = getFilePath(name);
      
  //     const path = `/uploads/private/works/${year}/${student[0].universityId}/${student[0].facultyId}/${work[0].id}/files/${filePath}`;
  //     formData.append('filePath', path);

  //     await handleAddFile({ name, size, type, workId, path });
  //   }

  //   try {
  //     const response = await fetch('/api/upload', {
  //       method: 'POST',
  //       body: formData, // Šalje FormData koji sadrži fajlove i podatke
  //     });

  //     if (!response.ok) {
  //       throw new Error('Greška prilikom upload-a');
  //     }

  //     const result = await response.json();
  //     console.log("Uspesno dodati fajlovi")
  //   } catch (error) {
  //     console.log(error)
  //   }
    
  //   setDisabled(false);
  // };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDisabled(true);
  
    // Dodavanje studenta
    const student = await addStudent({
      studentIdFK: selectedStudent?.id!,
      studentIndex: studentIndexNumber,
      name: selectedStudent?.name!,
      username: selectedStudent?.username!,
      email: selectedStudent?.email!,
      universityId: selectedStudent?.universityId!,
      universityName: selectedStudent?.university!,
      facultyId: selectedStudent?.facultyId!,
      facultyName: selectedStudent?.faculty!
    }).unwrap();
  
    // Dodavanje Radova
    const work = await addWork({
      studentId: student[0].id,
      name: workName.trim(),
      // @ts-ignore
      grade: workGrade.value,
      // @ts-ignore
      type: workType.value
    }).unwrap();
  
    const formData = new FormData();
    formData.append('workId', work[0].id.toString()); 
    formData.append('studentIdFK', student[0].id.toString());  
    formData.append('year', new Date().getFullYear().toString());
    formData.append('universityId', student[0].universityId.toString());  
    formData.append('facultyId', student[0].facultyId.toString());  
  
    // Dodavanje fajlova
    for (const file of uploadedFiles) {
      formData.append('files', file.file);  // Dodaj svaki fajl
    }
  
    try {
      const response = await fetch('http://localhost:1389/upload/work', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Greška prilikom upload-a');
      }
  
      const result = await response.json();
      console.log("Uspešno dodati fajlovi", result.files);
      navigate('/archive/');
    } catch (error: any) {
      console.log('Greška:', error.message);
    }
  
    setDisabled(false);
  };
  

  return (
    <MainLayout>
      <div className='w-full h-screen min-h-screen bg-secondary-custom sm:py-5 py-0 md:p-10 flex flex-col items-center overflow-y-scroll'>
        <FormContainer className='bg-bg-l-primary md:w-full lg:w-11/12 xl:w-8/12'>
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
              <Input id="studentIndexNumber" type="text" label="Студентов број индекса" value={studentIndexNumber} setValue={setStudentIndexNumber} />
              {workTypes &&
                <div>
                  <label htmlFor="professorSelect" className="text-[#9e9e9e] text-sm font-semibold">
                    Изаберите тип рада
                  </label>
                  <Select
                    id="studieLevelSelect"
                    isClearable
                    // @ts-ignore
                    options={workTypes}
                    value={workType}
                    // @ts-ignore
                    onChange={(selectedOption) => setWorkType(selectedOption)}
                    className="mt-1"
                    placeholder="Изаберите тип рада"
                    required
                  />
                </div>
              }
              <Input id="workName" type="text" label="Наслов теме" value={workName} setValue={setWorkName} />
              {/* Ocena rada */}
              <div>
                <label htmlFor="professorSelect" className="text-[#9e9e9e] text-sm font-semibold">
                  Оцена рада
                </label>
                <Select
                  id="workGrade"
                  isClearable
                  // @ts-ignore
                  options={workGradeOptions}
                  value={workGrade}
                  // @ts-ignore
                  onChange={(selectedOption) => setWorkGrade(selectedOption)}
                  className="mt-1"
                  placeholder="Изаберите оцену рада"
                />
              </div>
            </div>
            <div className='flex flex-col gap-5 pt-5 pb-3'>
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
