import GDS from 'generalised-datastore';

let gds;

let USERS, USERS_HASH;

const ds_conn = () => {
  gds = new GDS('battron').sync();

  USERS = gds.folder('users');
  USERS_HASH = gds.folder('user_hash', 'user');
};

export {gds, USERS, USERS_HASH};
export default ds_conn;
