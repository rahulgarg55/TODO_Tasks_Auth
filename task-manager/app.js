const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');

dotenv.config();

const authRoutes=require("./routes/authRoutes");
const taskRoutes=require("./routes/taskRoutes");

const app=express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>
    console.log("DB connected"))
    .catch(err=>console.log(err));

    app.use("/api/user",authRoutes);
    app.use("/api/tasks",taskRoutes);

    const PORT=process.env.PORT || 5000;
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });