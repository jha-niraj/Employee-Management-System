import InputBox from "../components/Input";
import Button from "../components/Button";
import { useUser } from "../Context/context";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { login } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3002/admin/signin", {
                username,
                password
            })
            toast.success(response.data.msg);
            setTimeout(() => {
                login(response.data);
                navigate("/dashboard");
            }, 1000);
        } catch (err) {
            toast.error("Unbale to Signin, Please try again!!!");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
            <Toaster />
            <nav className="bg-sky-500 p-4 shadow-md">
                <div class="container mx-auto flex items-center">
                    <div class="text-white text-xl font-bold">
                        Login Page
                    </div>
                </div>
            </nav>
            <main className="flex-grow flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <form
                        className="bg-white shadow-2xl rounded-lg p-8 space-y-6"
                        onSubmit={handleSubmit}
                    >
                        <h1 className="text-3xl text-red-500 font-bold text-center">
                            Welcome Back, Admin
                        </h1>
                        <InputBox
                            label="Username"
                            name="username"
                            value={username}
                            type="email"
                            id="username"
                            placeholder="you@example.com"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <InputBox
                            label="Password"
                            name="password"
                            value={password}
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            label="Login"
                            className="w-full"
                        />
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Authentication;