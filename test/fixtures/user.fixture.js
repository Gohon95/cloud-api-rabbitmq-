const { v4: uuidv4 } = require("uuid");

const User = require("../../src/models/user.model");

const userOne = {
  id: uuidv4(),
  pseudo: "userOne",
  email: "userone@mail.com",
  password: "userone",
  role: "user",
};

const userTwo = {
  id: uuidv4(),
  pseudo: "userTwo",
  email: "usertwo@mail.com",
  password: "usertwo",
  role: "user",
};

const admin = {
  id: uuidv4(),
  pseudo: "adminOne",
  email: "adminone@mail.com",
  password: "adminone",
  role: "admin",
};

const insertUsers = async (users) => {
  await User.bulkCreate(users);
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
