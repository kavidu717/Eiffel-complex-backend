import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './src/routes/userRoute.js';
import productRouter from './src/routes/productRoute.js';
import cartRouter from './src/routes/cartRoute.js';
import uploadRouter from './src/routes/uploadRoute.js';
import adminRouter from './src/routes/adminRoute.js';
import orderRouter from './src/routes/adminOrderRoute.js';
import userOrderRouter from './src/routes/orderRoute.js';
import paymentRouter from './src/routes/paymentRoute.js';



dotenv.config();

const app=express();

app.use(express.json());
app.use(cors());




mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err);
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/admin/user", adminRouter);
app.use("/api/v1/admin/order",orderRouter);
app.use("/api/v1/order",userOrderRouter);
app.use("/api/v1/payment",paymentRouter

)



 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
