import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Authentication from './pages/Authentication';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import CreateEmployee from './pages/CreateEmployee';
import UpdateEmployee from './pages/UpdateEmployee';
import { UserProvider } from './Context/context';
import EmployeeEditForm from './components/EditForm';

const App = () => {
	return (
		<UserProvider>
			<Routes>
				<Route path="/" element={<Authentication />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/employees" element={<EmployeeList />} />
				<Route path="/createemployee" element={<CreateEmployee />} />
				<Route path="/update" element={<UpdateEmployee />} />
				<Route path="/employee/edit/:id" element={<EmployeeEditForm />} />
			</Routes>
		</UserProvider>
	)
}

export default App
