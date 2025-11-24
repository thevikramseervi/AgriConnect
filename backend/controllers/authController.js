const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const generateToken = require("../utils/generateTokens");
const { asyncHandler, sendSuccess, AppError } = require("../utils/errorHandler");
const { HTTP_STATUS, MESSAGES } = require("../utils/constants");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, locality, address, phone } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(MESSAGES.AUTH.USER_EXISTS, HTTP_STATUS.BAD_REQUEST);
  }
  
  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    locality,
    address,
    phone,
  });

  await user.save();

  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.AUTH.REGISTER_SUCCESS, {
    token: generateToken(user),
    user: { id: user._id, name: user.name, role: user.role },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const knownUser = await User.findOne({ email });

  if (!knownUser) {
    throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
  }

  const isMatch = await bcryptjs.compare(password, knownUser.password);

  if (!isMatch) {
    throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.BAD_REQUEST);
  }

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.AUTH.LOGIN_SUCCESS, {
    token: generateToken(knownUser),
    user: { id: knownUser._id, name: knownUser.name, role: knownUser.role },
  });
});

module.exports = { registerUser, loginUser };
