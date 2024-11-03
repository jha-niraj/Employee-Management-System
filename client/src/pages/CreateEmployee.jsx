import { useState } from 'react';
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast"

const FormComponent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        designation: 'HR',
        gender: '',
        courses: {
            MCA: false,
            BCA: false,
            BSC: false,
        },
        img: '',
    });

    const handleChange = async (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                courses: { ...formData.courses, [name]: checked },
            });
        } else if (type === 'file') {
            setFormData({
                ...formData,
                img: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Upload the image first
        if (formData.img) {
            const imgData = new FormData();
            imgData.append('file', formData.img);

            try {
                const imgUploadResponse = await fetch('http://localhost:3005/upload', {
                    method: 'POST',
                    body: imgData,
                });

                const imgUploadResult = await imgUploadResponse.json();

                if (!imgUploadResponse.ok) {
                    throw new Error(imgUploadResult.error || 'Image upload failed');
                }

                const imgUrl = imgUploadResult.url;
                console.log(imgUrl);

                const dataToSend = {
                    ...formData,
                    imgUrl,
                    course: Object.keys(formData.courses).filter((course) => formData.courses[course]),
                };

                delete dataToSend.img;

                const response = await fetch('http://localhost:3005/employee/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.msg || 'Failed to create employee');
                }

                console.log('Employee created successfully:', result);
                toast.success('Employee created successfully');
                setFormData({ name: '', email: '', phoneNumber: '', designation: 'HR', gender: '', courses: { MCA: false, BCA: false, BSC: false }, image: ''});
            } catch (error) {
                console.error('Error:', error);
                alert(error.message);
            }
        } else {
            alert('Please upload an image');
        }
    };

    return (
        <section className='flex gap-10 flex-col w-full'>
            <Toaster />
            <Navbar />
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
                            value={formData.name}
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
                            value={formData.email}
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
                            value={formData.phoneNumber}
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
                            value={formData.designation}
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
                            <label>
                                <input
                                    type="checkbox"
                                    name="MCA"
                                    checked={formData.courses.MCA}
                                    onChange={handleChange}
                                />
                                MCA
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="BCA"
                                    checked={formData.courses.BCA}
                                    onChange={handleChange}
                                />
                                BCA
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="BSC"
                                    checked={formData.courses.BSC}
                                    onChange={handleChange}
                                />
                                BSC
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold" htmlFor="img">Img Upload:</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded"
                            type="file"
                            id="img"
                            name="img"
                            onChange={handleChange}
                            required
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
        </section>
    );
};

export default FormComponent;
