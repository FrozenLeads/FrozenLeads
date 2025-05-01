const  validator = require('validator');
const {URL} =  require('url')
const mongoose = require('mongoose')
const containsLink = (text) => /https?:\/\/|www\./i.test(text);


const validateSignupData = (req)=>{
    const {firstName,emailId,password,age,gender,photoUrl} = req.body;


    const isValidImageUrl = (urlString) => {
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
        // First, validate if the URL itself is correct
        if (!validator.isURL(urlString)) return false;
    
        try {
            const url = new URL(urlString);
    
            // Check if the URL contains a valid image extension anywhere in the pathname
            const pathname = url.pathname.toLowerCase();
            const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
    
            // If the pathname does not end with an image extension, check if the URL has query params that indicate it's an image
            if (!hasValidExtension && url.searchParams.has('q')) {
                return true;  // This is a heuristic check, assuming images with `q` query parameter in the URL are images
            }
    
            return hasValidExtension;
        } catch (error) {
            return false;  // Invalid URL format
        }
    };
    
    

    if(!firstName ){
        throw new Error('First Name is not valid')
    }
    else if(firstName.length<4 || firstName.length>50){
        throw new Error('First Name should be between 4-50 charactes')
    }
    else if(!emailId || !validator.isEmail(emailId)){
        throw new Error (emailId+'is not a valid email')
    }
    else if(!password || !validator.isStrongPassword(password)){
        throw new Error ('password is not strong enough')
    }
    else if (photoUrl && photoUrl.trim() && !isValidImageUrl(photoUrl)) {
        throw new Error('Photo URL is not valid');
    }
    
  
    else if (photoUrl && photoUrl.length > 500) {
        throw new Error('Image url is too long and is potentially unsafe');
    }
  
    else if (!['male', 'female', 'other'].includes(gender.toLowerCase().trim())) {
        throw new Error('Gender must be male, female, or other');
    }
    else if (typeof age !== 'number' || isNaN(age)) {
        throw new Error('Age must be a valid number');
    }
    else if (age < 18) {
        throw new Error('You must be at least 18 years old to sign up');
    }
    else if (age > 120) {
        throw new Error('Age must be less than 120');
    }
}

const ValidateEditProfileData = (req) => {
    const AllowedFields = [
        'firstName',
        'lastName',
        'emailId',
        'age',
        'gender',
        'photoUrl',
    ]

    const isEditAllowed = Object.keys(req.body).every((field) => {
        AllowedFields.includes(field)
    });

    return isEditAllowed
}

const ValidateLeadsData = (req)=>{
    const { 
        leadName,
        LeadEmailId,
        phone,
        source,
        status,
        notes,
        followUpDate            
    } = req.body;

    const validStatuses = [
        'New',        // Newly added lead, hasn't been contacted yet
        'Contacted',  // Lead has been contacted via email or phone
        'Interested', // Lead has shown interest in the job opportunity
        'Follow-up',  // Lead needs a follow-up (awaiting response)
        'No Response', // Lead hasn't responded after initial contact
        'Rejected',   // Lead has declined or is not interested
        'Hired',      // Lead has been hired
        'In Progress', // Lead is in an interview or recruitment stage
        'Not Interested' // Lead explicitly stated no interest
    ]


    if (!leadName || leadName.trim().length === 0) {
        throw new Error('Lead name cannot be empty');
    } else if (leadName.length < 4 || leadName.length > 50) {
        throw new Error('First Name should be between 4-50 characters');
    } else if (containsLink(leadName)) {
        throw new Error('Lead name should not contain links');
    }

    if (!LeadEmailId || !validator.isEmail(LeadEmailId)) {
        throw new Error('Email is not valid');
    }

    if (!phone || !validator.isMobilePhone(phone, 'any')) {
        throw new Error(`${phone} is not a valid mobile number`);
    }

    if (notes) {
        if (notes.length > 1000) {
            throw new Error('Notes should be less than 1000 characters');
        } else if (containsLink(notes)) {
            throw new Error('Notes should not contain links');
        }
    }

    if (source) {
        const isURL = validator.isURL(source);
        if (!isURL && source.length < 3) {
            throw new Error('Source should be a valid URL or minimum 3 characters');
        }
    }

    if (!status || status.trim().length === 0) {
        throw new Error('Status cannot be empty');
    } else if (!validStatuses.includes(status)) {
        throw new Error(`${status} is not a valid status`);
    }

    if (!followUpDate || !validator.isISO8601(followUpDate)) {
        throw new Error('Follow-up date is not in valid ISO8601 format (YYYY-MM-DD)');
    }
};
    




module.exports  = {validateSignupData,ValidateEditProfileData,ValidateLeadsData}