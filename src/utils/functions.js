import {month_index} from './constants';

const charset =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const combinations = {
  alnum: charset,
  num: '01234556789',
  alpha: 'abcdefghijklmnopqrstuvwxyz',
};

const shuffle_array = array => {
  const new_array = [...array];
  const length = new_array.length;

  for (let start = 0; start < length; start++) {
    const random_position = Math.floor(
      (new_array.length - start) * Math.random(),
    );
    const random_item = new_array.splice(random_position, 1);

    new_array.push(...random_item);
  }

  return new_array;
};

const to_title = string => {
  if (!string) return string;

  let str = '';
  string.split(' ').map(s => {
    if (s) str += ' ' + s[0].toUpperCase() + s.slice(1);
  });
  return str.trim();
};

const date_string = timestamp => {
  let date = new Date(timestamp);
  return `${date.getDate().toString().padStart(2, '0')} ${to_title(
    month_index[date.getMonth()],
  )} ${date.getFullYear()}`;
};

const time_string = timestamp => {
  let date = new Date(timestamp);

  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

const generate_random_string = (len, combination) => {
  let string = '';
  combination = combinations[combination] || combinations['num'];

  for (let i = 0; i < (len || 6); i++)
    string += combination[gen_random_int(combination.length)];

  return string;
};

const gen_random_int = (max_int, min_int = 0) =>
  min_int + Math.floor(Math.random() * max_int);

let phone_regex =
  /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;

let email_regex =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const next_quarter = () => {
  let date = new Date();
  let quarter = (date.getMonth() % 3) + 1,
    quarter_was_4;
  let curr_entry = quarter;

  if (quarter === 4) {
    quarter_was_4 = true;
    quarter = 1;
  }

  let propect_month = quarter * 3,
    propect_year = date.getFullYear();
  let str = `${month_index[propect_month]}, ${
    quarter_was_4 ? propect_year + 1 : propect_year
  }`;

  let next_prospect_month = propect_month + 2;
  let next_entry = `${
    month_index[next_prospect_month > 11 ? 0 : next_prospect_month]
  }, ${next_prospect_month > 11 ? propect_year + 1 : propect_year}`;

  let curr_year = propect_year;
  curr_entry = curr_entry - 1;

  if (curr_entry === 0) {
    curr_entry = 0;
  }

  let curr_month = curr_entry * 3 + 1;

  return {
    str,
    next_entry,
    curr_entry: {
      month: curr_month,
      quarter: curr_entry === 0 ? 1 : curr_entry,
      year: curr_year,
      str: `${month_index[curr_month - 1]}, ${curr_year}`,
    },
  };
};

const _id = prefix => {
  let random_value = '';
  for (let i = 0; i < gen_random_int(32, 12); i++)
    random_value += charset[gen_random_int(charset.length)];

  return `${prefix}~${random_value}~${Date.now()}`;
};

const commalise_figures_ = figure => {
  if (typeof figure !== 'number') {
    return figure;
  }

  if (figure >= 1e21) return figure.toLocaleString('fullwide');

  figure = figure.toString();
  if (figure.length <= 3) return figure;

  let ff = '',
    i;
  for (i = 0; i < figure.length; i += 3)
    ff = `${figure.slice(figure.length - i - 3, figure.length - i)},${ff}`;

  if (i < figure.length) ff = `${figure.slice(0, i)}${ff}`;
  else if (i > figure.length) {
    ff = `${figure.slice(0, figure.length % 3)}${ff}`;
  }
  if (ff.startsWith(',')) ff = ff.slice(1);

  return ff.slice(0, -1);
};

const commalise_figures = (value, no_fixed) => {
  if (typeof value !== 'number') {
    if (typeof value === 'string') {
      if (/[A-Za-z]\-/.test(value)) return value;
      else value = Number(value);

      if (!value) return;
    } else return value;
  }

  let integer = Math.floor(value);
  let decimal = (value - integer).toFixed(2).toString();

  let commalised = commalise_figures_(integer);

  return no_fixed
    ? commalised
    : `${commalised}${decimal.slice(decimal.indexOf('.'))}`;
};

const mask_id = _id => {
  _id = _id.split('~');
  _id.splice(0, 1);
  _id.unshift(_id[1].slice(5));
  _id[2] = _id[2].slice(0, 5);

  return _id.join('$');
};

const search_object = (object, param) => {
  if (Array.isArray(object)) return object.filter(o => search_object(o, param));

  param = param && param.trim().split();

  for (const prop in object) {
    let value = object[prop];
    if (typeof value === 'string') {
      value = value.toLowerCase().split(' ');
      for (let p = 0; p < param.length; p++)
        for (let v = 0; v < value.length; v++)
          if (value[v].includes(param[p].trim().toLowerCase())) return object;
    } else if (Array.isArray(value)) {
      if (value.find(v => search_object(v, param?.join(' ')))) return object;
    } else if (typeof value === 'object') {
      if (search_object(value, param?.join(' '))) return object;
    }
  }
};

const countdown = (end_date, return_function, callback, caller) => {
  let end = new Date(end_date).getTime();

  caller.countdown = setInterval(() => {
    let now = new Date().getTime();
    let distance = end - now;

    if (distance < 0) {
      clearInterval(caller.countdown);
      callback && callback();
      return;
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    let mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return_function && return_function({days, hours, mins, seconds});
  }, 1000);
};

export {
  _id,
  to_title,
  gen_random_int,
  generate_random_string,
  email_regex,
  phone_regex,
  date_string,
  search_object,
  time_string,
  next_quarter,
  shuffle_array,
  countdown,
  commalise_figures,
  mask_id,
};
