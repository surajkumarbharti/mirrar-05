const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { isValid, isValidObjectId, isValidRequestBody, isValidEmail, isValidName, isValidPassword, isValidPincode, isValidPhone,isValidCity, uploadFile } = require('../validator/validator')



//////////////////////////////////////////////////////////////////////////////////////////
const createUser = async function (req, res) {
    try {
        
        let data = req.body;
        let { fname, lname, email, phone, password,  } = data

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "please provide valid user Details" })
        }

        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: "first name is required" })
        }

        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: "last name is required" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Email-ID is required" })
        }

        if (!isValidEmail(email))
            return res.status(400).send({ status: false, message: "Invalid Email id." })

        const checkEmailFromDb = await userModel.findOne({ email: email })

        if (checkEmailFromDb) {
            return res.status(400).send({ status: false, message: `emailId is Exists. Please try another email Id.` })
        }

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "phone number is required" })
        }

        if (!isValidPhone(phone))
            return res.status(400).send({ status: false, message: "Phone number must be a valid Indian number." })

        const checkPhoneFromDb = await userModel.findOne({ phone: phone })

        if (checkPhoneFromDb) {
            return res.status(400).send({ status: false, message: `${phone} is already in use, Please try a new phone number.` })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password must be of 8-15 letters." })
        }


        const salt = await bcrypt.genSalt(10);
        hashPassword = await bcrypt.hash(password, salt);
        data.password = hashPassword


        let userData = await userModel.create(data);
        res.status(201).send({ status: true, message: "user Successfully created", data: userData })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }

};
////////////////////////////////////////////////////////////////////////////////

const userLogin = async function (req, res) {

    try {

        const loginDetails = req.body;

        const { email, password } = loginDetails;

        if (!isValidRequestBody(loginDetails)) {
            return res.status(400).send({ status: false, message: 'Please provide login details' })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Email-Id is required' })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: 'provide valid email id' })
        }


        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'Password is required' })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: 'Provide valid password its should contain atleast  one-lowercase, one uppercase,one numeric ' })
        }

        const userData = await userModel.findOne({ email });

        if (!userData) {
            return res.status(401).send({ status: false, message: `Login failed Email-Id is incorrect.` });
        }

        const checkPassword = await bcrypt.compare(password, userData.password)

        if (!checkPassword) return res.status(401).send({ status: false, message: `Login failed password is incorrect.` });

        let userId = userData._id

        const token = jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
        }, 'ProjectNo-5')

        return res.status(200).send({ status: true, message: "Login Successful", data: { Token: token } });

    } catch (err) {

        return res.status(500).send({ status: false, error: err.message });

    }
}

////////////////////////////////////////////////////////////////////////////

const getUserDetails = async function (req, res) {

    try {

        const userId = req.params.userId
        const userIdFromToken = req.userId


        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }

        const findUserDetails = await userModel.findById(userId)

        if (!findUserDetails) {
            return res.status(404).send({ status: false, message: "User Not Found" })
        }

        if (findUserDetails._id.toString() != userIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized" });
        }

        return res.status(200).send({ status: true, message: "Profile Fetched Successfully", data: findUserDetails })

    } catch (err) {

        return res.status(500).send({ status: false, error: err.message })

    }
}

/////////////////////////////////////////////////////////////////////////

const updateUserDetails = async function (req, res) {

    try {

        // let files = req.files
        let userDetails = req.body
        let userId = req.params.userId
        let userIdFromToken = req.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid UserId" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).send({ status: false, message: "user not found" })
        }

        if (userData._id.toString() != userIdFromToken) {//
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }

        let { fname, lname, email, phone, password, address,  } = userDetails


        if (!isValidRequestBody(userDetails)) {
            return res.status(400).send({ status: false, message: "Please provide user's details to update." })
        }
        if (fname) {
            if (!isValid(fname)) {
                return res.status(400).send({ status: false, message: 'first name is Required' })
            }
            if (!isValidName(fname)) {
                return res.status(400).send({ status: false, message: `${fname} is not valid` })
            }
            userData.fname = fname
        }
        if (lname) {
            if (!isValid(lname)) {
                return res.status(400).send({ status: false, message: 'last name is Required' })
            }
            if (!isValidName(lname)) {
                return res.status(400).send({ status: false, message: `${lname} is not valid` })
            }
            userData.lname = lname
        }

        if (email) {


            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: 'email is Required' })
            }
            if (!isValidEmail(email))
                return res.status(400).send({ status: false, message: "Invalid Email id." })

            const checkEmailFromDb = await userModel.findOne({ email: email })

            if (checkEmailFromDb)
                return res.status(404).send({ status: false, message: `emailId is Exists. Please try another email Id.` })
            userData.email = email
        }

        if (phone) {

            if (!isValid(phone)) {
                return res.status(400).send({ status: false, message: 'phone number is Required' })
            }

            if (!isValidPhone(phone))
                return res.status(400).send({ status: false, message: "Phone number must be a valid Indian number.it should start with 6,7,8 or 9" })

            const checkPhoneFromDb = await userModel.findOne({ phone: phone })

            if (checkPhoneFromDb) {
                return res.status(400).send({ status: false, message: `${phone} is already in use, Please try a new phone number.` })
            }
            userData.phone = phone
        }

        if (password) {

            if (!isValid(password)) {
                return res.status(400).send({ status: false, message: 'password is Required' })
            }

            if (!isValidPassword(password)) {
                return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 and also contain atleast one lowercase one uppercase one numeric" })
            }
            const salt = await bcrypt.genSalt(10);
            let hashPassword = await bcrypt.hash(password, salt);
            userData.password = hashPassword

        }

        userData.save()

        return res.status(200).send({ status: true, message: "Update succesful", data: userData })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}



module.exports.createUser = createUser
module.exports.userLogin = userLogin
module.exports.getUserDetails = getUserDetails
module.exports.updateUserDetails = updateUserDetails