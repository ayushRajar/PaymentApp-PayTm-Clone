const express = require("express");
const router = express.Router();
const {JWT_SECRET} = require("../config");
const jwt = require('jsonwebtoken')


const zod = require('zod');
const { User,Account } = require("../DB.JS");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    userName :zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()
});

router.post('/signup', async(req,res)=>{
    const body = req.body;
    const {success} = signupBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
              message: "Email already taken / Incorrect inputs"
        });
    }

    const existingUser = await User.findOne({
        userName:body.userName
    })

    if(existingUser){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
      });
    }

    const user = await User.create({
        firstName:body.firstName,
        lastName:body.lastName,
        userName:body.userName,
        password:body.password
    })

    const userId = user._id;

    await Account.create({
        userId,
        balance:1+Math.random()*1000
        
    })

    const token=jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        messsage:"User created successfully",
        token:token
    })
})

const signinBody = zod.object({
    userName:zod.String().email(),
    pasword:zod.String()
});

router.post('/signin',async(req,res) => {
    const body=req.body;
    const {success} = signinBody.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message:"Either user does not exist or the email or password is incorrect"
        });
    }

    const user =await User.findOne({
        userName:body.userName,
        password:body.password
    });

    if(user){
        const token = jwt.sign({
            userId:user._id
        },JWT_SECRET);

        res.json({
            token:token
        })
        return;
    }

    res.status(411).json({
        message:"Either user does not exist or the email or password is incorrect"
    })
})

const updateBody = zod.object({
    password:zod.String().optional(),
    firstName:zod.String().optional(),
    lastName:zod.String().optional()
})

router.put('/',authMiddleware,async(req,res) => {
    const {success}=updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            Message: "Error while updating the information"
        })
    }
    await User.updateOne({_id:req.userId},req.body);

    res.json({
        message:"Information updated successfully"
    })
})

router.get("/bulk",async(req,res)=>{
    const filter = req.query.filter ||"";

    const users = await User.findOne({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })

    res.json({
        user:users.map(user => ({
            userName:user.userName,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })

})


module.exports=router;