import {
  login,
  signup,
  update_user,
  user,
  users,
  user_by_email,
  verify_email,
  request_otp,
  update_password,
} from './handlers/users';

const router = app => {
  app.get('/user', user);

  app.post('/signup', signup);
  app.post('/login', login);
  app.post('/users', users);
  app.post('/user_by_email', user_by_email);
  app.post('/update_user/:user', update_user);
  app.post('/verify_email', verify_email);
  app.post('/request_otp', request_otp);
  app.post('/update_password', update_password);
};

export default router;
