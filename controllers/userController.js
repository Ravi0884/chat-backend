
// ----------This is the main page of backends from this page all creditials 
// are matching from database according to the data is fetching from the database-----------------------------------

const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// -----------------Defining a module for login purpose------------------------------------
module.exports.login = async (req, res, next) => {
  try {

    // -----------------Checking for userName that it is present in our DB or not-----------------------------------
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    // -------------------If not present then show an error and set status false--------------------------------
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    // -------------If yes then convert user password to bcrypt and compare it wit our DB pass--------------------
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });


    // -------------------------With the user variable there is password attach so delet it so noOne can access it----------------------------
    delete user.password;

    // ----------------------------Return the user and set status false---------------------------
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

// -----------------Defining a module for Registration purpose------------------------------------
module.exports.register = async (req, res, next) => {
  try {

    // ---------------Getting username,pass,email value from userinput in React---------------------------------
    const { username, email, password } = req.body;

    // -----------------Checking for userName that it is present in our DB or not-----------------------------------
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

   // -----------------Checking for Email that it is present in our DB or not-----------------------------------
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    // ---------------------Convert password to bcrypt--------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // -------------------------Create User data on DB and save it ---------------------------------------
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;

    // -------------------------With the user variable there is password attach so delet it so noOne can access it----------------------------
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};


// ----------------------Defining a module for Getting all user from DB except current user--------------------------------------
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};


// -------------Defining module for Setting Avatar-----------------------------------------
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};


// ---------------------Defining module for logOut options--------------------------------------------------
module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
