const z = require("zod");

const adminSignInSchema = z.object({
    username: z.string().email(),
    password: z.string()
})
const employeeCreationSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string(),
    designation: z.enum(['HR', 'Manager', 'Sales']),
    gender: z.enum(['Male', 'Female']),
    course: z.array(z.enum(['MCA', 'BCA', 'BSC'])).nonempty("At least one course is required"),
    imgUrl: z.string().nonempty("Image is required")
});

module.exports = {
    adminSignInSchema,
    employeeCreationSchema
}