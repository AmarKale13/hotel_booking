const express=require('express');
const {registerUser,LoginUser,getUserProfile}=require('../Controllers/authControllers');
const { isAuthenticated,isAdmin } = require('../middlewares/auth');
// const bcrypt=require('bcryptjs');
const User=require('../models/Users');
const router=express.Router();

router.post('/register',registerUser);
router.post('/login',LoginUser);
// router.get('/me', isAuthenticated, getUserProfile);

router.get('/me',isAuthenticated,async(req,res)=>{
    try{
        const user=await require('../models/Users').findById(req.user.userId).select('-password');
        if(!user){
            return res.status(404).json({message:"User not Found"});
        }
        res.json(user);
    }
    catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
});

router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports=router;