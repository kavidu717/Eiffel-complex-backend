import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadImage = async (req, res) => {
  
    try{
         if(!req.file){

            return res.status(400).json({
                message:"no file uploaded"
            })

        }

        // upload to cloudinary
        const streamUpload =(fileBuffer)=>{
            return new Promise((resolve,reject)=>{
                const stream = cloudinary.uploader.upload_stream(
                    (error,result)=>{
                        if(result){
                          
                              resolve(result)
                        }
                        else{
                            reject(error)
                        }

                    }
                )
            // use streamifier 
                streamifier.createReadStream(fileBuffer).pipe(stream)


            })
        }


      const result = await streamUpload(req.file.buffer)
      res.json({
        message:"image uploaded successfully",
        imageUrl:result.secure_url
      })
   
    }catch(error){
       
    }
  
};