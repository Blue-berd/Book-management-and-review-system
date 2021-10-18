const { systemConfig } = require("../configs");
const mongoose = require('mongoose')

const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

const validateEmail = function (email) {
  return re.test(email);
};

const validateDate = function (date) {
  return dateRegex.test(date);
};

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidTitle = function (title) {
  return systemConfig.titleEnumArray.indexOf(title) !== -1;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidLength = function (password) {
  return (password.length > 7 && password.length < 16);
};

const isValidRating = function (rating) {
  return (rating <= 5 && rating >=1);
};


module.exports = {
  validateEmail, validateDate,
  emailRegex: re,
  isValid, isValidLength,
  isValidObjectId,
  isValidTitle,
  isValidRequestBody,
  isValidRating
};
