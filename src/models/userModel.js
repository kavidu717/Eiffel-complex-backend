import mongoose from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    role:{
        type:String,
        enum:["admin","customer"],
        default:"customer"
    }
}
    ,{timestamps:true})

    // password hashing

userSchema.pre("save", async function() {

  // check if password modified
  if (!this.isModified("password")) return;

  // hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

    

export default mongoose.model("User",userSchema)
    
