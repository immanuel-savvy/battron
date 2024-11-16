import GDS from 'generalised-datastore';

let gds;

let USERS, USERS_HASH, LOGS, SUBSCRIPTIONS, USER_PAYMENTS;

const ds_conn = () => {
  gds = new GDS('battron').sync();

  USERS = gds.folder('users', null, 'subscription');
  USERS_HASH = gds.folder('user_hash', 'user');
  LOGS = gds.folder('logs');
  SUBSCRIPTIONS = gds.folder('subscriptions');
  USER_PAYMENTS = gds.folder('user_payments', 'user', 'payment');
};

export {gds, USERS, USERS_HASH, LOGS, SUBSCRIPTIONS, USER_PAYMENTS};
export default ds_conn;
