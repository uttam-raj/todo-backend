const {z} = require('zod');

const loginSchema = z.object({
    email:z
    .string({required_error:'Email is required'})
    .trim()
    .email({message:'Invalid email address'}),

    password:z
    .string({required_error:'Password is required'})
    .trim()
    .min(7,{message:'Password must be atleast 7 charater'})
    .max(255,{message:'Password must not more than 255 charater'})
})

const signupSchema = loginSchema.extend({
    name: z
    .string({required_error:'Name is required'}).min(1, "Name is required"),

    phone: z
    .string({required_error:'Phone number is required'})
    .min(10, "Phone must be at least 10 digits"),

  
    gender: z
    .enum(["male", "female", "other"], "Gender must be male, female, or other"),

    isVerified: z
    .boolean().optional(), // optional because it's usually set by backend
    otp: z
    .string().optional(),
    otpExpirationTime: z
    .coerce.date().optional(),
})

module.exports={loginSchema,signupSchema};