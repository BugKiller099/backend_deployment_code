
const mongoose = require('mongoose');

const { Schema, model } = mongoose; 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userSchema = new Schema({
    firstName: { 
        type: String, 
        required: true,
        minLength: 4, 
    },
    lastName: { type: String },
    emailId: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
    },
    password: { 
        type: String,
        required: true, 
    },
    age: { type: Number },
    gender: { 
        type: String,
        validate: {
            validator: function(value) {
                return ["male", "female", "None"].includes(value);
            },
            message: props => `${props.value} is not a valid gender option.`
        }
    },
    photoUrl: {
        type: String, 
        default: "https://geo.com"
    },
    skills:{
        type: [String],
    }
},{timestamps: true});

// Ensure index creation
userSchema.index({ emailId: 1 }, { unique: true });



// Force index creation asynchronously
(async () => {
    try {
        await User.syncIndexes();
        console.log("Indexes synced successfully.");
    } catch (error) {
        console.error("Error syncing indexes:", error);
    }
})();
userSchema.methods.getJWT = async function() {
    const user = this;

    const token = await jwt.sign({ _id: user._id}, "Ashif@123" , {
        expiresIn: "7d",
    });

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash =  user.password;
    const isPasswordValid= await bcrypt.compare(
        passwordInputByUser , 
        passwordHash

    );

    return isPasswordValid;

}
const User = model("User", userSchema);
module.exports = User;
