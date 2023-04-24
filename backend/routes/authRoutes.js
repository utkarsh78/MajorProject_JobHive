const express = require("express");
const passport = require("passport");
const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const logger = require("../loggerFile");
const winston = require("winston");

const router = express.Router();

router.post("/signup", (req, res) => {
  const data = req.body;
  if(data.password.length <8){
    res.status(400).json({
      message:"Password must be more than 8 characters.",
    })
    return;
  }
  User.findOne({email:data.email})
  .then((user)=>{
    if(user!= null){
      res.status(400).json({
        message: "The email address you have entered is already associated with another account.",
      });
      return;
    }else{
        let user = new User({
          email: data.email,
          password: data.password,
          type: data.type,
        });

        user
          .save()
          .then(() => {
            const userDetails =
              user.type == "recruiter"
                ? new Recruiter({
                    userId: user._id,
                    name: data.name,
                    contactNumber: data.contactNumber,
                    bio: data.bio,
                  })
                : new JobApplicant({
                    userId: user._id,
                    name: data.name,
                    education: data.education,
                    skills: data.skills,
                    rating: data.rating,
                    resume: data.resume,
                    profile: data.profile,
                  });

            userDetails
              .save()
              .then(() => {
                // Token
                const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
                if(user.type === "recruiter"){
                  logger.info('New Recruiter Signed up')
                }
                else{
                  logger.info('New Job Applicant Signed up')
                }
                res.json({
                  token: token,
                  type: user.type,
                });
              })
              .catch((err) => {
                user
                  .delete()
                  .then(() => {
                    res.status(400).json(err);
                  })
                  .catch((err) => {
                    res.json({ error: err });
                  });
                err;
              });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
        }
      })
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token

      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      logger.info("User Logged in Successfully")
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

// router.post("/forgetPassword",(req , res , next)=>{
//   try {
//     const email = req.body.email;
//     User.findOne({email:email})
//     .then((user)=>{
//       if(user){
//         const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
//         User.updateOne({email:email})
//         .then((data)=>{
//           try {
//             nodemailer.createTransport({
//               host:'smpt.gmail.com',
//               port:587,
//               secure:false,
//               requireTLS:true,
//               auth:{
//                 user:
//               }
//             })
//           } catch (error) {
//             res.status(400).send({success:false,msg:error.message})
//           }
//         })

//         res.status(200).send({success:true , msg:'please check ur inbox for password reset'})
//       }
//       else{
//         res.status(200).send({success:true , msg:"this email doesnt exists"})
//       }
//     })
//   } catch (error) {
//     res.status(400).send({success:false , msg:error.message})
//   }
// })

module.exports = router;
