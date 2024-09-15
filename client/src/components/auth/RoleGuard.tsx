import React, { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../ui/Loader/Loader';
import { useAppSelector } from '../../store/hooks';
import { useGetUserRoleQuery } from '../../store/api/userSlice';

interface RoleGuardProps {
  requiredRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ requiredRoles }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const id = useAppSelector((state) => state.user.id);
  const parsedId = parseInt(id);

  const { data, isLoading } = useGetUserRoleQuery(parsedId, {
    refetchOnFocus: true
  });

  useEffect(() => {
    if (data && !requiredRoles.includes(data.role)) {
      navigate('/', { state: { from: location } });
    }
  }, [data, requiredRoles, navigate, location]);

  if (isLoading) return <Loader />;

  return requiredRoles.includes(data?.role!) ? <Outlet /> : null;
};

export default RoleGuard;