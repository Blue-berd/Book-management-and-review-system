const { userModel } = require("../models");

const { validator, jwt } = require("../utils");

const { systemConfig } = require("../configs");

const registerUser = async function (req, res) {
  try {
    let requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, msg: "request body is required" });
      return
    }

    const { name, title, phone, email, password, address } = requestBody;

    if (!validator.isValid(title)) {
      res.status(400).send({ status: false, msg: "title is required" });
      return
    }

    if (!validator.isValidTitle(title)) {
      res.status(400).send({
        status: false,
        msg: `${systemConfig.titleEnumArray.join(",")} is required`,
      });
      return
    }

    if (!validator.isValid(name)) {
      res.status(400).send({ status: false, msg: "name is required" });
      return
    }

    if (!validator.isValid(phone)) {
      res.status(400).send({ status: false, msg: "phone is required" });
      return
    }

    if (!validator.isValid(email)) {
      res.status(400).send({ status: false, msg: "email is required" });
      return
    }

    if (!validator.isValid(password)) {

      res.status(400).send({ status: false, msg: "Password is required" });

      return

    }
    if (!validator.validateEmail(email)) {
      res.status(400).send({ status: false, msg: "email is not valid" });
      return
    }

    if (!validator.isValidLength(password)) {
      res.status(400).send({ status: false, msg: "Password length ust be in between 8-15" });
      return
    }

    const isEmailAlreadyUsed = await userModel.findOne({ email }); // {email: email} object shorthand property

    if (isEmailAlreadyUsed) {
      res.status(400).send({ status: false, message: `${email} email address is already registered` });
      return;
    }

    const isPhoneAlreadyUsed = await userModel.findOne({ phone }); // {email: email} object shorthand property

    if (isPhoneAlreadyUsed) {
      res
        .status(400)
        .send({
          status: false,
          message: `${phone} phone is already registered`,
        });
      return;
    }

    if (!validator.isValid(password)) {
      res.status(400).send({ status: false, msg: "password is required" });
      return
    }

    const newUser = { title, name, phone, email, password, address };
    const createUser = await userModel.create(newUser);
    res.status(201).send({ status: true, message:"Success",data: createUser });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, message: 'Invalid Request Parameters' })
      return
    }
    const { email, password } = requestBody;

    if (!validator.isValid(email)) {
      res.status(400).send({ status: false, msg: "email is required" });
      return
    }

    if (!validator.validateEmail(email)) {
      res.status(400).send({ status: false, message: 'Invalid email' })
      return
    }

    

    if (!validator.isValid(password)) {
      res.status(400).send({ status: false, message: 'Password is required' })
      return
    }

    const user = await userModel.findOne({ email, password }, { isDeleted: false })

    if (!user) {
      res.status(404).send({ status: false, message: "Invalid Login Credentials" })
    }

    const token = await jwt.createToken({ userId: user._id });

    res.header('x-api-key', token);
    res.status(200).send({ status: true, message: `Success`, data: { token } });

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
}


module.exports = {
  registerUser,
  loginUser,
};
