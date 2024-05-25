const express = require("express");
const router = express.Router()
const OtpModel = require("../models/Otp")


// const twilio = require("twilio");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const twilioClient = new twilio(accountSid,authToken);

router.post("/send-otp", async (req,res)=>{
try {
    const {name,email,phoneNumber} = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
   await OtpModel.findOneAndUpdate(
        {name,email,phoneNumber},
        {name,email,phoneNumber,otp},
        {upsert:true, new:true, setDefaultsOnInsert: true}
    );

//    await twilioClient.messages.create({
//         body:Your OTP is:${otp},
//         to:phoneNumber,
//         from:process.env.TWILIO_PHONE_NUMBER
//     });
    
   return res.status(200).json({
    success:true,
    otp:`Otp Send Successfully ${otp}`   
}) 
} catch (error) {
    res.status(500).json(error)
}
})

router.post("/verify-otp", async (req,res)=>{
    try {
        const {phoneNumber,otp} = req.body;
        const otpData = await OtpModel.findOne({
            phoneNumber,
            otp
        })
        if(!otpData){
            return res.status(400).json({
                success:false,
                msg:"You Entered Wrong OTP"
            });
        }

    //   const isOtpExpired = await otpVerification(otpData.otpExpiration)
    //     if(isOtpExpired){
    //         return res.status(400).json({
    //             success:false,
    //             msg:"Your OPT has been Expired"
    //         });
    //     }
        return res.status(200).json({
            success:true,
            msg:"OTP verified Successfull...!"
        })

        
    } catch (error) {
        res.status(500).json(error)

    }
})

//// total number of user
router.get("/total-user", async (req,res) => {
    try {
        const totalUsers = await OtpModel.countDocuments();
        res.status(200).json({totalUsers})
        
    } catch (error) {
        res.status(500).json({error:"Fail to calculate Total user"})
    }
})

//// get all user

router.get("/all-user", async (req,res) => {
    try {
        const allUser = await OtpModel.find();
        res.status(200).json(allUser)
        
    } catch (error) {
        res.status(500).json({error:"Fail to get all user"})
    }
})


module.exports = router