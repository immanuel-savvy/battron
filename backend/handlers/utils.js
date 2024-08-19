import fs from 'fs';
import {generate_random_string} from 'generalised-datastore/utils/functions';

let strip_length = 8,
  prefix = 'Battron';

const Paystack_public_key = 'pk_test_88c19524a2abc3ad156a72952316e0f77ca87f4e';
const Paystack_private_key = 'sk_test_8f53d8f0d9303a18a856d4aeba97603d0795fdcb';

const save_image = (base64_image, image_name) => {
  if (!base64_image || (base64_image && !base64_image.startsWith('data')))
    return base64_image;

  image_name = `${prefix}_${image_name || Date.now()}${
    image_name ? '' : generate_random_string(6, 'alpha')
  }.jpg`;
  let image_path =
    __dirname.slice(0, __dirname.length - strip_length) +
    `assets/images/${image_name}`;
  fs.writeFileSync(
    image_path,
    Buffer.from(base64_image.slice(base64_image.indexOf(',')), 'base64'),
  );

  return image_name;
};

const save_file = (base64_file, file_name) => {
  if (!base64_file || (base64_file && !base64_file.startsWith('data')))
    return base64_file;

  file_name = `${prefix}_${
    file_name ? file_name.split('.')[0] + `-${Date.now()}` : Date.now()
  }${file_name ? '' : generate_random_string(6, 'alpha')}.${
    file_name.split('.').slice(-1)[0]
  }`;
  let file_path =
    __dirname.slice(0, __dirname.length - strip_length) +
    `assets/files/${file_name}`;
  fs.writeFileSync(
    file_path,
    Buffer.from(base64_file.slice(base64_file.indexOf(',')), 'base64'),
  );

  return file_name;
};

const save_video = base6_video => {
  if (!base6_video || (base6_video && !base6_video.startsWith('data')))
    return base6_video;

  let video_name = `${prefix}_${Date.now()}${generate_random_string(
    6,
    'alpha',
  )}.mp4`;
  let video_path =
    __dirname.slice(0, __dirname.length - strip_length) +
    `assets/videos/${video_name}`;
  fs.writeFileSync(
    video_path,
    Buffer.from(base6_video.slice(base6_video.indexOf(',')), 'base64'),
  );

  return video_name;
};

const remove_image = image => {
  if (image === 'user_image_placeholder.png' || !image) return;

  try {
    let image_path =
      __dirname.slice(0, __dirname.length - strip_length) +
      `assets/images/${image}`;
    fs.unlinkSync(image_path);
  } catch (e) {}
};

const remove_file = file => {
  if (file === 'user_image_placeholder.png' || !file) return;

  try {
    let file_path =
      __dirname.slice(0, __dirname.length - strip_length) +
      `assets/files/${file}`;
    fs.unlinkSync(file_path);
  } catch (e) {}
};

const remove_video = video => {
  if (video === 'user_image_placeholder.png' || !video) return;

  try {
    let video_path =
      __dirname.slice(0, __dirname.length - strip_length) +
      `assets/videos/${video}`;
    fs.unlinkSync(video_path);
  } catch (e) {}
};

export {
  save_file,
  save_image,
  save_video,
  remove_file,
  remove_image,
  remove_video,
  Paystack_private_key,
  Paystack_public_key,
};
