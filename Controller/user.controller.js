const Jwt = require('jsonwebtoken')
const jwtkey = "e-com";
const User = require('../model/user.model');

exports.signinUser = async (req, res) => {
    const user = req.body;
    const { name, email, password, confirmpassword } = user;
    try {
        if (!name) throw new Error('Name is Required');
        if (!email) throw new Error('Email is Required');
        if (!password) throw new Error('Password is Required');
        if (!confirmpassword) throw new Error('Confirm Password is Required');
        if (password !== confirmpassword) {
            throw new Error('Password and Confirm Password do not match');
        }
        let result = await User.create(user);

        result.set("toObject", { virtuals: true })
        delete result.password;
        delete result.confirmpassword;
        Jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
            if (err) {
                res.send({ result: "Somthing went wrong,please after somtime" })
            } else {
                res.send({
                    result,
                    auth: token,
                    status: "success",
                    message: "Signing Successfully"
                })
            }
        })
    } catch (err) {
        let message;
        if (err.name === "MongoServerError" && err.code === 11000) message = "Url already exists. Please change url.";

        res.json({
            status: 'fail',
            message: message || err.message || 'Unknown error occur.',
            data: null,
        });
    }
};

exports.loginUser = async (req, res) => {
    const data = req.body;
    const {  email, password, confirmpassword } = data;
try{
    if (!email) throw new Error('Email is Required');
    if (!password) throw new Error('Password is Required');
    if (!confirmpassword) throw new Error('Confirm Password is Required');
    if (password !== confirmpassword) {
        throw new Error('Password and Confirm Password do not match');
    }
     
        let user = await User.find(req.body)

        if (user) {
         
            Jwt.sign({ user }, jwtkey, (err, token) => {
             
                if (err) {
                    res.send({ result: "somthing Went Wrong,please try after some time" })
                } else {
                    res.send({
                        status: "success",
                        message: "Login Successfully",
                        user,
                        auth: token,
                    })
                }
            })
        } else {
            res.send({ result: "No user found" })
        }
    }catch (err) {
        let message;
        if (err.name === "MongoServerError" && err.code === 11000) message = "Url already exists. Please change url.";

        res.json({
            status: 'fail',
            message: message || err.message || 'Unknown error occur.',
            data: null,
        });
    }
    
};

exports.getUser = async (req, res) => {
    let user = await User.find(req.body)
    if (user.length > 0) {
        res.send({
            status: "success",
            message: "User Get Successfully",
            result:user
        })
    } else {
        res.send({ 
            status: "fail",
            message: "No User Found",
            result: null
         })
    }
    
};

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        if (updatedData.password || updatedData.confirmpassword) {
            if (!updatedData.password || !updatedData.confirmpassword) {
                throw new Error('Both password and confirm password are required');
            }
            if (updatedData.password !== updatedData.confirmpassword) {
                throw new Error('Password and Confirm Password do not match');
            }
            // const hashedPassword = await bcrypt.hash(updatedData.password, 10);
            // updatedData.password = hashedPassword;
            // delete updatedData.confirmpassword;
        }
        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({
            status: 'success',
            message: 'User data updated successfully.',
            data: updatedUser,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message || 'Unknown error occurred.',
            data: null,
        });
    }
    
};

exports.searchUser = verifyToken , async (req, res) => {
    let user = await User.find({
        "$or": [
            {
                name: { $regex: req.params.key }
            },
            {
                email: { $regex: req.params.key }
            }
        ]
    })
    res.send(user)
}


function verifyToken(req, res, next) {
    let token = req.headers['authorization']
    if (token) {
        token = token.split(' ')[1]
        Jwt.verify(token, jwtkey, (err, valid) => {
            if (err) {
                res.send({ result: "Please valid token" })
            } else {
                next()
            }
        })
    } else {
        res.send({ result: "add token with header" })
    }
}