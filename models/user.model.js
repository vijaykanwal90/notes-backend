import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
    
  },
   email:{
    type:String,
    required:true,
   },


  password: {
    type: String,
    required: true,
    minlength: 8,
  },


},
{ timestamps: true }
);
userSchema.methods.verifyPassword = async function (passwordByUser){
  const user = this;
  const passwordHash = user.password;
  const isValid = await bcrypt.compare(passwordByUser, passwordHash);
  return isValid;
}
userSchema.methods.getJWT = async function (){
  // this doest not work with arrow functions
  const user = this;
  const token = await jwt.sign({id:user._id},"ScriptGuru@123",{expiresIn:"1d"});
  return token;
}
export const User = mongoose.model("User", userSchema);
