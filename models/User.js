const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        userType: {
            type: String,
            default: "client",
        },
    },
    { timestamps: true }
);

UserSchema.method("transform", function () {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
});

const User = new mongoose.model("User", UserSchema);

module.exports = {
    UserSchema,
    User,
};
