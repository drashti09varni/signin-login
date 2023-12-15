const express = require("express");
const mongoose = require("mongoose");
const userRouter = require('./Router/user.router');


const Database_Url = 'mongodb://127.0.0.1:27017/e-comm';
const PORT = 5000;

mongoose.connect(Database_Url)
  .then(() => console.log("connected to the database"))
  .catch((err) => console.log(err.message));

const app = express();
app.use(express.json())
app.use('/api/v1', userRouter);
   
app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
  });
