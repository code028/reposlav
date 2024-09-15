import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const GuestGuard: React.FC = () => {
  const navigate = useNavigate();
  
  const refreshToken = useAppSelector((state) => state.session.refreshToken);

  useEffect(() => {
    if (refreshToken) {
      navigate('/');
    }
  }, [refreshToken, navigate]);

  return !refreshToken ? <Outlet /> : null;
};

export default GuestGuard;
