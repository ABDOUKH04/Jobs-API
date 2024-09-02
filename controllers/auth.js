require('dotenv').config()
const userSchema = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError ,UnauthenticatedError} = require('../errors')


const register = async (req, res) => {
  
    const user = await userSchema.create({...req.body})
    const token = user.createJwt()
    res.status(StatusCodes.CREATED).json({user:{name: user.name}, token})
};

const login = async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    throw new BadRequestError("please provide an email or password")
  }
  const user = await userSchema.findOne({email})
  if (!user) {
    throw new UnauthenticatedError("unvalid email")
  }

  const isPasswordCorrect = await user.checkPassword(password)

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("unvalid password")
  }
  const token = user.createJwt()
  res.status(StatusCodes.OK).json({user:{name:user.name}, token})
};

module.exports = { register, login };
