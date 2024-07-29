import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import InputBox from "../components/Input";

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ searchEmployee, setSearchEmployee ] = useState("");
    const navigate = useNavigate();
    const [ filteredEmployee, setFilteredEmployee ] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:3002/employee/allemployees");
                setEmployees(response.data.employees);
                setFilteredEmployee(response.data.employees);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        setFilteredEmployee(employees);
    }, [employees])

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await axios.post(`http://localhost:3002/employee/delete`, {
                    id
                });
                if (!response) {
                    throw new Error('Failed to delete');
                }
                toast.success(response.data.msg);
                setEmployees(employees.filter((emp) => emp._id !== id));
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    const handleSearchEmployee = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchEmployee(e.target.value);
        
        if(searchEmployee === "") {
            setFilteredEmployee(employees);
        } else {
            const searchedEmployee = employees.filter((employee) => 
                employee.name.toLowerCase().includes(searchTerm)
            )
            setFilteredEmployee(searchedEmployee);
        }
    }

    const routeForImage = "http://localhost:3002";

    return (
        <section className="flex flex-col min-h-screen">
            <Toaster />
            <Navbar />

            <main className="flex-1 p-4">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl font-bold mb-4">Employee List</h1>
                    <InputBox type="text" placeholder="Search for Employee" id="employee" value={searchEmployee} onChange={handleSearchEmployee} />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left">ID</th>
                                <th className="py-2 px-4 text-left">Image</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Phone Number</th>
                                <th className="py-2 px-4 text-left">Designation</th>
                                <th className="py-2 px-4 text-left">Gender</th>
                                <th className="py-2 px-4 text-left">Course</th>
                                <th className="py-2 px-4 text-left">Created Date</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployee.map((employee) => (
                                <tr key={employee._id} className="border-b">
                                    <td className="py-2 px-4 w-20 truncate">{employee._id}</td>
                                    <td className="py-2 px-4">
                                        <img
                                            src={`${routeForImage}${employee.image}`}
                                            alt={employee.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="py-2 px-4">{employee.name}</td>
                                    <td className="py-2 px-4">{employee.email}</td>
                                    <td className="py-2 px-4">{employee.phoneNumber}</td>
                                    <td className="py-2 px-4">{employee.designation}</td>
                                    <td className="py-2 px-4">{employee.gender}</td>
                                    <td className="py-2 px-4">{employee.course.join(', ')}</td>
                                    <td>{new Date(employee.createdAt).toLocaleDateString().split("/").reverse().join("-")}</td>
                                    <td className="py-2 px-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/employee/edit/${employee._id}`)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </section>
    );
}

export default EmployeeList;
