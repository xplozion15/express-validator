// controllers/usersController.js
const usersStorage = require("../storages/userStorages");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters?";
const lengthErr = "must be between 1 and 10 characters ok?";
const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email").isEmail().withMessage("proper format pls"),
  body("age").isInt({ min: 5, max: 20 }).withMessage("5 to 20 only age XD"),
  body("bio")
    .isLength({ min: 5, max: 200 })
    .withMessage("max 1 max 200 only pls "),
];

exports.getGetUser = (req, res) => {
  const { emailsearch } = req.query;
  const user = usersStorage.getUsers().find((el) => el.email === emailsearch);
  if (user !== undefined) {
    res.render("search", { user: user });
  } else {
    res.send("element not found");
  }
};

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersCreatePost = (req, res) => {
  const { firstName, lastName, email, age, bio } = req.body;
  usersStorage.addUser({ firstName, lastName, email, age, bio });
  res.redirect("/");
};

//

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });
    res.redirect("/");
  },
];

// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};
