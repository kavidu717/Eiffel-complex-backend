import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userRegister = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    console.log("hello");

    // check email exist
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ firstName, lastName, email, password });
    await user.save();

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// register the user
const userLogin = async (req, res) => {
  const { email, password } = req.body;

try{

    const user =await User.findOne({email})

    if(!user){
      return res.status(400).json({
        success: false,
        message: "invalid email",

       

      });
    }

    const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "invalid password",
        });
      }

        
        const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

       const token = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });





}
catch(error){
  console.log(error);
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
}

};




export { userRegister,userLogin };