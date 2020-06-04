const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require("validator/lib/isEmpty");
const isEmail = require("validator/lib/isEmail");
const { promisify } = require("util");
const { User } = require("../../../models/User");
const secretKey = "a4@801??983";
const hashPass = promisify(bcrypt.hash);

const createToken = async (payload) => {
    try {
        const token = await jwt.sign(payload, secretKey, { expiresIn: "2h" });
        return token;
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const createUser = async (req, res) => {
    const { email, password, confirmPassword, name } = req.body;
    const validatedFields = ["email", "password", "confirmPassword", "name"];
    let errors = {};

    for (let field of validatedFields) {
        if (!req.body[field]) {
            errors[field] = `Please enter ${field}`;
        }
    }
    if (Object.keys(errors).length) return res.status(500).json(errors);
    if (password.length < 8) errors.password = "Password must have at least 8 characters";
    if (password !== confirmPassword) errors.confirmPassword = "Password and confirmPassword does not match";
    if (!isEmail(email)) errors.email = "Email is not valid";
    if (Object.keys(errors).length) return res.status(500).json({ error: errors });
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already exists" });

    const hash = await hashPass(password, 10);
    const newUser = new User({
        email,
        name,
        password: hash,
    });
    try {
        await newUser.save();
        const { id } = newUser;
        const token = await createToken({ id, email, name });
        return res.status(201).json({ token, user: { id, email, name } });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    if (isEmpty(email)) return res.status(400).json({ error: "Email is required" });
    if (isEmpty(password)) return res.status(400).json({ error: "Password is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(500).json({ error: "Email does not exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Password does not match" });

    delete user.password;
    const token = await createToken(resData);
    return res.status(200).json({
        token,
        user,
    });
};

module.exports = {
    createUser,
    signIn,
};
