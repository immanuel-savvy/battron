import {USERS, USERS_HASH, USER_PAYMENTS, SUBSCRIPTIONS} from '../ds/conn';
import nodemailer from 'nodemailer';
import {generate_random_string} from 'generalised-datastore/utils/functions';
import {verification} from './emails';
import {remove_image, save_image} from './utils';

let email_verification_codes = new Object();

const to_title = string => {
  if (!string) return string;

  let str = '';
  string.split(' ').map(s => {
    if (s) str += ' ' + s[0].toUpperCase() + s.slice(1);
  });
  return str.trim();
};

const send_mail = ({
  recipient,
  recipient_name,
  sender_name,
  subject,
  text,
  html,
  to,
}) => {
  let transporter;

  text = text || '';
  html = html || '';
  let sender = 'register@battron.tech';
  sender_name = sender_name || 'Battron';

  try {
    transporter = nodemailer.createTransport({
      host: 'battron.tech',
      port: 465,
      secure: true,
      auth: {
        user: sender,
        pass: 'battronregister',
      },
    });

    console.log('in here with', recipient || to);
  } catch (e) {}

  try {
    transporter
      .sendMail({
        from: `${sender_name} <${sender}>`,
        to: to || `${recipient_name} <${recipient}>`,
        subject,
        text,
        html,
      })
      .then(() => {})
      .catch(e => console.log(e));
    console.log('Email sent', recipient);
  } catch (e) {}
};

const users = (req, res) => {
  let {query, limit, skip} = req.body;

  res.json({
    ok: true,
    message: 'users',
    data: USERS.read(query, {limit, skip}),
  });
};

const signup = (req, res) => {
  let user = req.body;

  let key = user.password;
  delete user.password;
  user.email = user.email.toLowerCase().trim();

  let user_exists = USERS.readone({email: user.email});

  if (user_exists)
    return res.json({
      ok: false,
      message: 'user exists',
      data: 'email already used.',
    });

  if (user_exists) {
    user._id = user_exists._id;

    USERS_HASH.update({user: user._id}, {key});
  } else {
    user.start = Date.now();
    let result = USERS.write({...user});
    user._id = result._id;
    user.created = result.created;

    USERS_HASH.write({user: user._id, key});
  }

  let code = generate_random_string(6);
  email_verification_codes[user.email] = code;

  send_mail({
    recipient: user.email,
    subject: '[Battron] Please verify your email',
    sender_name: 'Battron',
    html: verification(code),
  });

  res.json({
    ok: true,
    message: 'user signup',
    data: {email: user.email, _id: user._id},
  });
};

const request_otp = (req, res) => {
  let {email, subject} = req.body;

  let code = generate_random_string(6);
  email_verification_codes[email.trim().toLowerCase()] = code;

  send_mail({
    recipient: email,
    subject: subject || '[Battron] Please verify your email',
    sender_name: 'Battron',
    html: verification(code),
  });

  res.end();
};

const user_by_email = (req, res) => {
  let {email} = req.body;

  res.json({
    ok: true,
    message: 'user by email',
    data: USERS.readone({email}) || 'User not found',
  });
};

const update_user = (req, res) => {
  let {user} = req.params;

  let user_obj = req.body;

  let prior_user = USERS.readone(user);
  if (prior_user.image && user_obj.image && !user_obj.image.endsWith('.jpg'))
    remove_image(prior_user.image);

  user_obj.image = save_image(user_obj.image);

  user = USERS.update(user, {...user_obj});

  res.json({
    ok: true,
    message: 'user updated',
    data: {...user, image: user_obj.image},
  });
};

const user = (req, res) => {
  let query = req.query;
  console.log(query);

  let payment = USER_PAYMENTS.read({user: query.email});
  console.log(payment);
  payment = payment.sort((p1, p2) => p1.created - p2.created).slice(-1)[0];

  if (payment) {
    payment = payment.payment._id
      ? payment.payment
      : SUBSCRIPTIONS.readone(payment.payment);
    if (payment.type === 'monthly') {
      if (payment.created + 30 * 1000 * 24 * 60 * 60 < Date.now()) {
        payment = query.include_epxired ? payment : null;
      }
    } else if (payment.type === 'annually') {
      if (payment.created + 30 * 1000 * 365 * 60 * 60 < Date.now()) {
        payment = query.include_epxired ? payment : null;
      }
    }
  }
  res.json({ok: true, message: 'user fetched', data: payment});
};

const verify_email = (req, res) => {
  let {email, verification_code} = req.body;

  email = email && email.trim().toLowerCase();
  verification_code = verification_code && verification_code.trim();

  let code = email_verification_codes[email];

  if (!code || code !== verification_code)
    return res.json({
      ok: false,
      message: '',
      data: 'Email verification failed.',
    });

  let user = USERS.readone({email});
  USERS.update(user._id, {verified: true});

  res.json({ok: true, message: 'user email verified', data: user});
};

const login = (req, res) => {
  let {email, password} = req.body;

  let user = USERS.readone({email: email.toLowerCase()});
  if (!user)
    return res.json({
      ok: false,
      message: 'user not found',
      data: 'User not found',
    });

  let user_hash = USERS_HASH.readone({user: user._id});
  if (!user_hash || (user_hash && user_hash.key !== password))
    return res.json({
      ok: false,
      message: 'invalid password',
      data: 'Invalid password',
    });

  res.json({ok: true, message: 'user logged-in', data: user});
};

const update_password = (req, res) => {
  let {email, password} = req.body;

  let user = USERS.readone({email: email.toLowerCase()});

  if (!user)
    return res.json({
      ok: false,
      message: 'user not found',
      data: 'User not found',
    });

  USERS_HASH.update({user: user._id}, {key: password});

  res.json({ok: true, data: user});
};

export {
  signup,
  login,
  user_by_email,
  user,
  send_mail,
  verify_email,
  to_title,
  update_user,
  update_password,
  request_otp,
  users,
};
