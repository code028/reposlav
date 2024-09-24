import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/auth/ResetPassword";
import UniversityHome from "./pages/universities/UniversityHome";
import UniversityShow from "./pages/universities/UniversityShow";
import UniversityAdd from "./pages/universities/UniversityAdd";
import UniversityEdit from "./pages/universities/UniversityEdit";
import FacultyAdd from "./pages/faculties/FacultyAdd";
import FacultyShow from "./pages/faculties/FacultyShow";
import FacultyHome from "./pages/faculties/FacultyHome";
import FacultyEdit from "./pages/faculties/FacultyEdit";
import DepartmentHome from "./pages/departments/DepartmentHome";
import DepartmentShow from "./pages/departments/DepartmentShow";
import DepartmentAdd from "./pages/departments/DepartmentAdd";
import DepartmentEdit from "./pages/departments/DepartmentEdit";
import ProtectedRoute from "./components/auth/RouteGuard";
import RoleGuard from "./components/auth/RoleGuard";
import Loader from "./components/ui/Loader/Loader";
import GuestGuard from "./components/auth/GuestGuard";
import CustomFacultyAdd from "./pages/faculties/customAdd";
import SubjectHome from "./pages/subjects/SubjectHome";
import SubjectAdd from "./pages/subjects/SubjectAdd";
import SubjectShow from "./pages/subjects/SubjectShow";
import SubjectEdit from "./pages/subjects/SubjectEdit";
import CustomDepartmentAdd from "./pages/departments/CustomDepartmentAdd";
import Profile from "./pages/Profile";
import RegisterService from "./pages/auth/RegisterService";
import RegisterProfessor from "./pages/auth/RegisterProfessor";
import StudentAdd from "./pages/students/StudentAdd";
import ProfessorAdd from "./pages/professors/ProfessorAdd";
import StudentHome from "./pages/students/StudentHome";
import StudentEdit from "./pages/students/StudentEdit";
import StudentShow from "./pages/students/StudentShow";
import ProfessorEdit from "./pages/professors/ProfessorEdit";
import ProfessorShow from "./pages/professors/ProfessorShow";
import ProfessorHome from "./pages/professors/ProfessorHome";
import ServiceHome from "./pages/services/ServiceHome";
import ServiceShow from "./pages/services/ServiceShow";
import ServiceEdit from "./pages/services/ServiceEdit";
import ServiceAdd from "./pages/services/ServiceAdd";
import ServiceAddUser from "./pages/services/ServiceAddUser";
import WorkAdd from "./pages/work/WorkAdd";
import WorkShow from "./pages/work/WorkShow";
import WorkEdit from "./pages/work/WorkEdit";
import WorkHome from "./pages/work/WorkHome";
import Archive from "./pages/Archive";
import AdminGuide from "./pages/guide/AdminGuide";
import ServiceGuide from "./pages/guide/ServiceGuide";
import ProfessorGuide from "./pages/guide/ProfessorGuide";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Preventing the loading of undesirable content at startup
  useEffect(() => {
    window.addEventListener('load', () => {
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {
    return <Loader />
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Protected routes */}
          <Route element={<ProtectedRoute />} >
            <Route path="/profile" element={<Profile />} />
            <Route path="/archive/" element={<Archive />} />
            <Route path="/guide/professor" element={<ProfessorGuide />} />

            <Route element={<RoleGuard requiredRoles={['professor']} />}>
              <Route path="/work/add" element={<WorkAdd />} />
              <Route path="/work/:id" element={<WorkShow />} />
              <Route path="/work/:id/edit" element={<WorkEdit />} />
              <Route path="/professor/works/" element={<WorkHome />} />
            </Route>

            {/* Role protected routes */}
            <Route element={<RoleGuard requiredRoles={['admin','service']} />}>
              <Route path="/guide/service" element={<ServiceGuide />} />
              
              <Route path="/auth/register/student" element={<Register />} />
              <Route path="/auth/register/service" element={<RegisterService />} />
              <Route path="/auth/register/professor" element={<RegisterProfessor />} />
                
              {/* Departments */}
              <Route path="/departments/" element={<DepartmentHome />} />
              <Route path="/uni/:uniId/fac/:facId/dep/:depId" element={<DepartmentShow />} />
              <Route path="/uni/:uniId/fac/:facId/dep/add" element={<DepartmentAdd />} />
              <Route path="/dep/add" element={<CustomDepartmentAdd />} />
              
              <Route path="/uni/:uniId/fac/:facId/dep/:depId/edit" element={<DepartmentEdit />} />

              {/* Subjects */}
              <Route path="/subjects/" element={<SubjectHome />} />
              <Route path="/sub/:id/" element={<SubjectShow />} />
              <Route path="/sub/add" element={<SubjectAdd/>} />
              <Route path="/sub/:id/edit" element={<SubjectEdit />} />

              {/* Profesor & Student registration*/}
              <Route path="/register/professor" element={<RegisterProfessor />} />
              <Route path="/register/student" element={<Register />} />

              {/* Profesor & Student add [onDepartmetns / onFaculty] */}
              <Route path="/prof/add" element={<ProfessorAdd />} />
              <Route path="/stud/add" element={<StudentAdd />} />

              {/* Professors */}
              <Route path="/professors/" element={<ProfessorHome />} />
              <Route path="/prof/:id/edit" element={<ProfessorEdit />} />
              <Route path="/prof/:id" element={<ProfessorShow />} />

              {/* Students */}
              <Route path="/students/" element={<StudentHome />} />
              <Route path="/stud/:id/edit" element={<StudentEdit />} />
              <Route path="/stud/:id" element={<StudentShow />} />
              
            </Route>
            
            <Route element={<RoleGuard requiredRoles={['admin']} />}>          
              <Route path="/guide/admin" element={<AdminGuide />} />

              {/* University */}
              <Route path="/universities/" element={<UniversityHome />} />
              <Route path="uni/:id/" element={<UniversityShow />} />
              <Route path="/uni/add" element={<UniversityAdd />} />
              <Route path="/uni/:id/edit" element={<UniversityEdit />} />

              {/* Faculty */}
              <Route path="/uni/:id/fac/add" element={<FacultyAdd />} />
              <Route path="/uni/:id/fac/:id2/edit" element={<FacultyEdit />} />
              <Route path="/faculty/add" element={<CustomFacultyAdd />} />
              <Route path="/uni/:id/fac/:id2" element={<FacultyShow />} />
              <Route path="/faculties/" element={<FacultyHome />} />

              <Route path="/register/service" element={<RegisterService />} />

              {/* Service */}
              <Route path="/service/add" element={<ServiceAdd />} />
              <Route path="/uni/:id/fac/:id2/service/:id3/edit" element={<ServiceEdit />} />
              <Route path="/uni/:id/fac/:id2/service/:id3" element={<ServiceShow />} />
              <Route path="/services/" element={<ServiceHome />} />
              <Route path="/service/:id/add" element={<ServiceAddUser />} />
            </Route>
          </Route>

          {/* Main and only guest route */}
          <Route element={<GuestGuard />}>
            <Route path="/auth/login" element={<Login />} />
          </Route>

          {/* Auth */}
          <Route path="/password/reset" element={<ResetPassword />} />

          {/* 404 PAGE */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
