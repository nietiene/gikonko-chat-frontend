import Login from "./pages/login"
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom"
import Register from "./pages/register"
import Dashboard from "./pages/dashboard"
import Chat from "./pages/chat"
import Layout from "./pages/layout"
import CreateGroup from "./pages/CreateGroup"
import GroupMember from "./pages/gorupMember"

function App() {

  return (

         <Routes>
            <Route path="/" element={<Login />} />
         
            <Route element={<Layout/>}>
               <Route path="/register" element={<Register />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/chat" element={<Chat />}/>
               <Route path="/create-group" element={<CreateGroup />}/>
               <Route path="/group-members/:g_id" element={<GroupMember />}/>
           </Route>
         </Routes>

  )
}

export default App
