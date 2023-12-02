const { unlink, rename } = require('fs');
const { isObject } = require('./validation');
const { generateRandomString } = require('./function');

function getFilesMimetype(string, symbol) {
  const mimetype = string.split(symbol);
  return `${mimetype[mimetype.length - 1]}`;
}

function tooMuchFiles(files, min, max) {
  if (files.length < min) throw new Error(`You need to uploads at least ${min}`);
  if (files.length > max) throw new Error(`You cant uploads more than ${max} files`);
}

function testFilesSize(files, maxSize) {
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSize * 1048576) throw new Error(`Each Files Cannot be bigger than ${maxSize} Mb`);
  }
}

function testFilesMimetype(files, allowedMimetype) {
  for (let i = 0; i < files.length; i++) {
    const filesMimetype = getFilesMimetype(files[i].mimetype, '/');

    if (!allowedMimetype.includes(filesMimetype)) {
      throw new Error(`We only accept those kinds of files type: ${allowedMimetype.join(', ')}`);
    }
  }
}

function ImageUploadsValidation({
  min = 0, max = 3, maxSize = 5, isRequired = false, errorUrl = '/404', allowedMimetype = ['png', 'jpg', 'jpeg'],
} = {}) {
  return (req, res, next) => {
    try {
      if (req.files) {
        const filesKeys = Object.keys(req.files);

        for (let i = 0; i < filesKeys.length; i++) {
          let files = req.files[filesKeys[i]];

          if (isObject(files)) files = [files];

          tooMuchFiles(files, min, max);
          testFilesSize(files, maxSize);
          testFilesMimetype(files, allowedMimetype);

          req.body[filesKeys[i]] = files;
        }
      }
      if (!req.files && isRequired) throw new Error('You need to submit at least one File');

      next();
    } catch (e) {
      console.log(e);
      req.flash('error', e.message);
      res.redirect(`${errorUrl}`);
    }
  };
}

function returnedImagePath(filePath) {
  const splitedPath = filePath.split('/');

  return `/${splitedPath[splitedPath.length - 2]}/${splitedPath[splitedPath.length - 1]}`;
}

function generateRandomName(name) {
  return `${generateRandomString(17, 'CharInt')}.${getFilesMimetype(name, '.')}`;
}

function getFilesPath(folderName) {
  if (folderName === 'product') return './uploads/productImg/';
  if (folderName === 'user') return './uploads/userImg/';
  return folderName;
}

function uploadsFiles(files, folderName, createRandomName = true) {
  const imagesPaths = [];

  let filePath = getFilesPath(folderName);

  for (let i = 0; i < files.length; i++) {
    if (createRandomName) {
      files[i].name = generateRandomName(files[i].name);

      filePath += `${files[i].name}`;
    }

    imagesPaths.push(returnedImagePath(filePath));

    files[i].mv(filePath, (err) => {
      if (err) throw new Error(err);
    });
  }

  if (imagesPaths.length > 1) return imagesPaths;
  return imagesPaths[0];
}

function deleteImage(path) {
  unlink(path, (err) => {
    if (err) console.log(`No file to delete at this location: ${path}`);
  });
}

function renameImage(oldName, newName) {
  rename(oldName, newName, (err) => {
    if (err) throw err;
  });
}

module.exports = {
  uploadsFiles, ImageUploadsValidation, deleteImage, renameImage, generateRandomName,
};
