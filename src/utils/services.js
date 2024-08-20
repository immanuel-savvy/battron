let DEV = true;
let PRD = !DEV;

let domain = `${
  PRD
    ? 'https://api.themacaddress.com'
    : false
    ? 'http://192.168.43.203:1450'
    : 'http://10.0.2.2:1450'
}`;

let sock_domain = DEV
  ? 'http://10.0.2.2:3602/'
  : 'https://sock.giitafrica.com/';

const get_request = async path => {
  if (path && path.startsWith('/')) path = path.slice(1);

  try {
    let ftch = await fetch(`${domain}/${path}`);
    let res;
    try {
      res = await ftch.json();
    } catch (e) {
      return {_$not_sent: true};
    }

    return res && res.data;
  } catch (e) {
    return;
  }
};

const post_request = async (path, data) => {
  if (path && path.startsWith('/')) path = path.slice(1);
  try {
    let ftch = await fetch(`${domain}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: data && JSON.stringify(data),
    });

    let res;
    try {
      res = await ftch.json();
    } catch (e) {
      return {_$not_sent: true};
    }

    return res && res.data;
  } catch (e) {
    return;
  }
};

export {post_request, get_request, domain, sock_domain};
