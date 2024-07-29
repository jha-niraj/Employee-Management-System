const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");
const { Employee } = require("../modal");
const { employeeCreationSchema } = require("../zod");

router.post("/create", async(req, res) => {
    try {
        const { name, email, phoneNumber, designation, gender, course, imgUrl } = req.body;

        const parsedValue = employeeCreationSchema.safeParse({ name, email, phoneNumber, designation, gender, course, imgUrl });
        console.log(parsedValue.error);
        if (!parsedValue.success) {
            return res.status(511).json({
                msg: "Error while parsing the data!!!",
                errors: parsedValue.error.errors
            })
        } else {
            const existingEmployee = await Employee.findOne({
                email: email
            })
            if (existingEmployee) {
                return res.status(511).json({
                    msg: "Emplpoyee with this email exists"
                })
            } else {
                const newEmployee = await Employee.create({ name, email, phoneNumber, designation, gender, course, image: imgUrl });
                if (!newEmployee) {
                    return res.status(511).json({
                        msg: "Failed to create an Employee"
                    })
                } else {
                    return res.status(200).json({
                        msg: "Employee created Successfully"
                    })
                }
            }
        }
    } catch (err) {
        console.log("Error, while creating an Employee: " + err);
        return res.status(511).json({
            msg: "Error while creating Employee"
        })
    }
})
router.get("/allemployees", async (req, res) => {
    try {
        const employees = await Employee.find({});
        if(employees.length > 0) {
            return res.status(200).json({
                employees
            })
        } else {
            return res.status(304).json({
                msg: "No Employee in the Database"
            })
        }
    } catch(err) {
        console.log("Error in Getting all emplpoyee list: " + err);
        return res.status(511).json({
            msg: "Error while getting all Employee list"
        })
    }
})
router.get("/oneemployee/:id", async (req, res) => {
    const { id } = req.params;

    try {   
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                msg: "Employee not found"
            });
        } else {
            return res.status(200).json({
                employee
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Cannot fetch the Employee details"
        });
    }
});
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updateData = { ...req.body };

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ success: true, employee: updatedEmployee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


router.post("/delete", async(req, res) => {
    const { id } = req.body;

    try {
        const response = await Employee.findByIdAndDelete(
            { 
                _id: id
            }
        )
        if(!response) {
            return res.status(411).json({
                msg: "Failed to delete the Employee"
            })
        } else {
            console.log("Hii");
            return res.status(200).json({
                msg: "Employee deleted successfully"
            })
        }
    } catch(err) {
        console.log("Error occurred while deleting the employee: " + err);
        return res.status(501).json({
            msg: "Error while deleting!!!"
        })
    }
})

module.exports = router;