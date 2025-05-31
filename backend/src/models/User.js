import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlenght: 6
    },
    profileImage: {
        type: String,
        default:""
    }
}, { timestamps: true} );

//HASH PASSWD
UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
   
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

//PASS COMPARATION
UserSchema.methods.comparePassword = async function (userPassword) {

    return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;