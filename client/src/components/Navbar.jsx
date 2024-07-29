import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/context";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();

    if(!user) {
        navigate("/")
    }

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-slate-500 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div onClick={() => navigate("/dashboard")} className="text-white text-xl font-bold cursor-pointer">
                    DealsDary
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-white font-medium text-md">
                        Admin
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-900 text-white px-3 py-2 rounded-md hover:bg-red-600 transition">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
