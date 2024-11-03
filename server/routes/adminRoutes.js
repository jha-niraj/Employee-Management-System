const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { Admin } = require("../modal");
const { adminSignInSchema } = require("../zod");

router.post("/signin", async(req, res) => {
    const { username, password } = req.body;

    try {
        const parsedValue = adminSignInSchema.safeParse({ username, password });
        if (!parsedValue.success) {
            res.status(511).json({
                msg: "Error while parsing value!!!"
            })
            return;
        } else {
            const admin = await Admin.findOne({ username });
            if (!admin) {
                res.status(511).json({
                    msg: "Email not Found!!!"
                })
                return;
            } else {
                const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
                res.cookie("auth_token", token, {
                    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
                    path: '/',
                    secure: true,  // Use true if you're using HTTPS
                    sameSite: 'None'
                });
                res.status(200).json({
                    msg: 'User Authentication Successfull',
                    id: admin._id,
                    username: admin.username,
                    token: token
                })
            }
        }
    } catch(err) {
        console.log("Error: " + err);
        res.status(501).json({
            msg: "Error while signin!!!"
        })
        return;
    }
})

module.exports = router;