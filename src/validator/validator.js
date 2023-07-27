const mongoose = require('mongoose')



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false 
    if (typeof value === 'string' && value.trim().length === 0) return false 
    return true;
};
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
//to check id is valid or not

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0; 
};
//to check any  data available or not
const isValidName = function (name) {
    let nameRegex = /^[a-zA-z]*$/
    return nameRegex.test(name)
}
//regex for name 
const isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}
// regex for email validation   

const isValidPhone = function (phone) {
    let mobileRegex = /^[0]?[6789]\d{9}$/
    return mobileRegex.test(phone)
}
//10 didgit mobile number stating with any(6,7,8,9) and 0 if you want to use in mobile number 

const isValidPincode = function (pincode) {
    let pincodeRegex = /^\d{6}$/
    return pincodeRegex.test(pincode)
}
// pincode should be 6 digit

const isValidPassword = function (password) {
    let passwordregex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#@$%&? "])[a-zA-Z0-9!#@$%&?]{8,15}$/
    return passwordregex.test(password)

}
//  One digit, one upper case , one lower case , its b/w 8 to 15

const isValidCity = function (city) {
    let cityRegex = /^[a-zA-z]+([\s][a-zA-Z]+)*$/

    return cityRegex.test(city)
}
const validString = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidScripts= function(title){
    const scriptRegex = /^(?![0-9]*$)[A-Za-z0-9\s\-_,\.;:()]+$/
    return scriptRegex.test(title)
}

const isValidNumber = function (value) {
    if (typeof (value) === "number" && (value).toString().trim().length > 0) { return true }    //it checks whether the number contain only space or not
};


module.exports = { isValid, isValidObjectId,isValidRequestBody ,isValidEmail,isValidName,isValidPassword,isValidPincode,isValidPhone,isValidCity,validString ,isValidScripts,isValidNumber}