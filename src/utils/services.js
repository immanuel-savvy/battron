let DEV = true;
let PRD = !DEV;

let domain = `${
  PRD
    ? 'https://api.battron.tech'
    : false
    ? 'http://192.168.21.11:1451'
    : 'http://10.0.2.2:1451'
}`;

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

export {post_request, get_request, domain};
