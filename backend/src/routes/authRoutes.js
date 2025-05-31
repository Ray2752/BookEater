import express from "express";
import User from "../models/User.js"
import jwt from "jsonwebtoken";

const router =express.Router();
const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: "15d"})
};

router.post("/register", async (req, res) => {
    try {
    const {email,username,password} = req.body
    if(!username || !email || !password){
        return res.status(400).json({ message: "All fields are requiered" });
    }

    if(password.length < 6){
        return res.status(400).json({ message: "The password needs to have 6 characters mínimum" });
    }

    if(username.length < 3){
        return res.status(400).json({ message: "The username needs to have 3 characters mínimum" });
    }

//USER DUPLICATION (CHECK)

    const existingEmail = await User.findOne({ email });
        if (existingEmail){
            return res.status(400).json({ message: "Email already exists"});
        }
    
     const existingUsername = await User.findOne({ username });
        if (existingUsername){
            return res.status(400).json({ message: "Username already exists"});
        }

//AVATARS
    const profileImage = `http://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({
        email,
        username,
        password,
        profileImage,
    })

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
        token,
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt,

        },
    });

    } catch (error) {
        console.log("Error in register route", error);
        res.status(600).json({ message: "Internal server error"}); 
    }
}) 

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validación de campos requeridos
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Buscar usuario
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }  

        // Verificar contraseña
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);


        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email, 
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Error in login route:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;