import React from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const RouteGuard: React.FC = () => {
  const accessToken = useAppSelector((state) => state.session.accessToken);
  const refreshToken = useAppSelector((state) => state.session.refreshToken);

  if (!refreshToken && !accessToken) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default RouteGuard;
