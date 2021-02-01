import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    avatar : { type: String , default : "https://res.cloudinary.com/momuzio/image/upload/v1605729168/avatar.png"},
    time : { type : Date, default: Date.now }
});
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});
userSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        return next(error);
    }
};
const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;
