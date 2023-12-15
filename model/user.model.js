const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema({
    name : {
        type : String
    } , 
    email : {
        type : String,
        required : true
    } ,
    password : {
        type : String,
        required : true
    } , 
    confirmpassword : {
        type : String,
        required : true
    }
	
}, {timestamps: true});

const Login = mongoose.model('user', loginSchema);

module.exports = Login;