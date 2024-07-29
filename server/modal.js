const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    designation: {
        type: String,
        required: true,
        enum: ['HR', 'Manager', 'Sales']
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    course: {
        type: [String],
        required: true,
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


const Admin = mongoose.model("Admin", adminSchema);
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = {
    Admin,
    Employee
}