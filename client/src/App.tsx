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

            {/* Role protected routes */}
            <Route element={<RoleGuard requiredRoles={['admin','service']} />}>
              <Route path="/auth/register" element={<Register />} />
              {/* Faculties */}
              <Route path="/faculties/" element={<FacultyHome />} />
              <Route path="uni/:id/fac/:id" element={<FacultyShow />} />
                
              {/* Departments */}
              <Route path="/departments/" element={<DepartmentHome />} />
              <Route path="uni/:id/fac/:id/dep/:id" element={<DepartmentShow />} />
              <Route path="uni/:id/fac/:id/dep/add" element={<DepartmentAdd />} />
              <Route path="uni/:id/fac/:id/dep/:id" element={<DepartmentEdit />} />
            </Route>
            
            <Route element={<RoleGuard requiredRoles={['admin']} />}>
              {/* University */}
              <Route path="/universities/" element={<UniversityHome />} />
              <Route path="uni/:id/" element={<UniversityShow />} />
              <Route path="/uni/add" element={<UniversityAdd />} />
              <Route path="/uni/:id/edit" element={<UniversityEdit />} />

              {/* Faculty add/edit */}
              <Route path="uni/:id/fac/add" element={<FacultyAdd />} />
              <Route path="uni/:id/fac/:id/edit" element={<FacultyEdit />} />
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
