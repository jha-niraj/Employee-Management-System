const Button = ({ label, onClick }) => {
    return (
        <div className="flex items-center justify-center pt-5 w-full">
            <button className="w-[100%] bg-gray-300 hover:bg-black hover:text-white rounded-lg h-10 text-xl font-small transition-all duration-500" type="submit" onClick={onClick}>{label}</button>
        </div>
    )
}

export default Button;