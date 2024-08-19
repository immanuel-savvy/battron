import {
  login,
  signup,
  update_user,
  user,
  users,
  user_by_email,
  verify_email,
} from './handlers/users';

const router = app => {
  app.get('/user/:user_id', user);

  app.post('/signup', signup);
  app.post('/login', login);
  app.post('/users', users);
  app.post('/user_by_email', user_by_email);
  app.post('/update_user/:user', update_user);
  app.post('/verify_email', verify_email);
};

export default router;
