import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
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
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />

            {/* Role protected routes */}
            <Route element={<RoleGuard requiredRoles={['admin','service']} />}>
              <Route path="/auth/register" element={<Register />} />
                
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
            </Route>
            
            <Route element={<RoleGuard requiredRoles={['admin']} />}>
              {/* University */}
              <Route path="/universities/" element={<UniversityHome />} />
              <Route path="uni/:id/" element={<UniversityShow />} />
              <Route path="/uni/add" element={<UniversityAdd />} />
              <Route path="/uni/:id/edit" element={<UniversityEdit />} />

              {/* Faculty */}
              <Route path="/uni/:id/fac/add" element={<FacultyAdd />} />
              <Route path="/uni/:id/fac/:id/edit" element={<FacultyEdit />} />
              <Route path="/faculty/add" element={<CustomFacultyAdd />} />
              <Route path="/uni/:id/fac/:id2" element={<FacultyShow />} />

              <Route path="/faculties/" element={<FacultyHome />} />
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
