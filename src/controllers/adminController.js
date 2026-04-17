import User from "../models/userModel.js";
import { protect, admin } from "../middleware/authMiddleware.js";



// get the all users

 const getAllUsers = async (req, res) => {
   try{

    const users=await User.find({})
    res.status(200)
    .json({
        success:true,
        message:"users fetched successfully",
        users
    })

   }catch(error){
         console.log(error)
         res.status(500)
         .json({
             message:"something went wrong"
             
         })
 }
}

// the user

const addUsers = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try{

        let user=await User.findOne({email})
        if(user){
            return res.status(400).json({
                success: false,
                message: "user already exists",
            });
        }
        user=new User({
    firstName,
    lastName,
    email,
    password,
    role   
          })
           await user.save()
        res.status(200)
        .json({
            success:true,
            message:"user created successfully",
            user
        })
        

    }catch(error){
        console.log(error)
        res.status(500)
        .json({
            message:"something went wrong"
            
        })
    }
    

}

const updateUser=async(req,res)=>{
    try{

        const user= await User.findById(req.params.id)
        if(!user){
            return res.status(400).json({
                success: false,
                message: "user not found",
            });
        }
        user.firstName=req.body.firstName
        user.lastName=req.body.lastName
        user.email=req.body.email
        user.role=req.body.role
        await user.save()
        res.status(200)
        .json({
            success:true,
            message:"user updated successfully",
            user
        })

    }
    catch(error){
        console.log(error)
        res.status(500)
        .json({
            message:"something went wrong"
            
        })
    }



}

const deleteUser=async(req,res)=>{
      try{
      
        const user= await User.findById(req.params.id)
        if(!user){
            return res.status(400).json({
                success: false,
                message: "user not found",
            });
        }
        await user.deleteOne()
        res.status(200)
        .json({
            success:true,
            message:"user deleted successfully",
            user
        })


      }
      catch(error){
          console.log(error)
          res.status(500)
          .json({
              message:"something went wrong"
              
          })
      }
     
}














 export { getAllUsers, addUsers , updateUser,deleteUser}