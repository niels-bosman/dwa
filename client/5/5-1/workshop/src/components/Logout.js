import React from 'react';

import AuthenticationAPI from '../api/AuthenticationAPI';
import { Redirect } from 'react-router-dom';

export const Logout = () => {
  AuthenticationAPI.logout();
  return <Redirect to="/"/>;
};
