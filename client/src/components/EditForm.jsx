import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";

const EmployeeEditForm = () => {
    const { id } = useParams();

    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchformData = async () => {
            try {
                const response = await axios.get(`http://localhost:3002/employee/oneemployee/${id}`);
                const employeeData = response.data.employee;
                const courseObject = employeeData.course.reduce((acc, course) => {
                    acc[course] = true;
                    return acc;
                }, {});
    
                setFormData({
                    ...employeeData,
                    course: courseObject
                });
    
            } catch (err) {
                console.log("Error occurred: " + err);
                toast.error("Error occurred while fetching details");
            }
        }
        fetchformData();
    }, [])

    console.log(formData);

    const routeForImage = "http://localhost:3002";

    const handleChange = async (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                course: { ...formData.course, [name]: checked },
            });
        } else if (type === 'file') {
            setFormData({
                ...formData,
                image: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = formData.image;

            if (formData.image instanceof File) {
                const imgData = new FormData();
                imgData.append('file', formData.image);

                const imageUpload = await fetch('http://localhost:3002/upload', {
                    method: 'POST',
                    body: imgData
                })

                const imgUploadResult = await imageUpload.json();

                if (!imgUploadResult) {
                    throw new Error(imgUploadResult.error || 'Image upload Failed');
                }

                imageUrl = imgUploadResult.url;
                console.log(imageUrl);
            }

            const dataToSend = {
                ...formData,
                image: imageUrl,
                course: Array.isArray(formData.course)
                    ? formData.course
                    : Object.keys(formData.course || {}).filter((course) => formData.course[course])
            }

            delete dataToSend.img;

            const response = await fetch(`http://localhost:3002/employee/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.msg || 'Failed to update employee');
            }

            console.log('Employee updated successfully:', result);
            toast.success('Employee updated successfully');
        } catch (err) {
            console.error('Error:', err);
            toast.error(err.message);
        }
    }

    return (
        <section>
            <Toaster />
            <Navbar />
            <div>
                Editing the Employee Id: {id}
                <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Create Employee</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="name">Name:</label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded"
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="email">Email:</label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                required
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                title="Please enter a valid email address"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="mobileNumber">Mobile Number:</label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded"
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber || ""}
                                onChange={handleChange}
                                required
                                pattern="^[0-9]{10}$"
                                title="Please enter a valid 10-digit mobile number"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="designation">Designation:</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded"
                                id="designation"
                                name="designation"
                                value={formData.designation || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="HR">HR</option>
                                <option value="Manager">Manager</option>
                                <option value="Sales">Sales</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Gender:</label>
                            <div className="space-x-4">
                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Male"
                                        checked={formData.gender === 'Male'}
                                        onChange={handleChange}
                                        required
                                    />
                                    Male
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Female"
                                        checked={formData.gender === 'Female'}
                                        onChange={handleChange}
                                        required
                                    />
                                    Female
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Course:</label>
                            <div className="space-x-4">
                                {['MCA', 'BCA', 'BSC'].map((course) => (
                                    <label key={course}>
                                        <input
                                            type="checkbox"
                                            name={course}
                                            checked={formData.course?.[course] || false}
                                            onChange={handleChange}
                                        />
                                        {course}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div>
                                <img src={`${routeForImage}${formData.image}`} alt="Employee Image Preview" />
                            </div>
                            <label className="block mb-2 font-semibold" htmlFor="img">Img Upload:</label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded"
                                type="file"
                                id="img"
                                name="img"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <button
                                className="w-full p-2 bg-black text-white font-semibold rounded hover:bg-slate-400 transition-all duration-300"
                                type="submit"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default EmployeeEditForm;