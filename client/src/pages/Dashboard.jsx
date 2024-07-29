import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Button from "../components/Button";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
            <Navbar />
            <div className="flex-grow h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold w-full text-center">Welcome, Admin Panel</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-[90%] gap-3">
                    <Button label="Create Employee" onClick={() => navigate("/createemployee")} />
                    <Button label="Employees List" onClick={() => navigate("/employees")} />
                </div>
            </div>
        </section>
    )
}

export default Dashboard;