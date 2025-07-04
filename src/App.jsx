import Login from "./pages/login"
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom"
import Register from "./pages/register"
import Dashboard from "./pages/dashboard"
import Chat from "./pages/chat"
import Layout from "./pages/layout"

function App() {

  return (

         <Routes>
            <Route path="/" element={<Login />} />
         
            <Route element={<Layout/>}>
               <Route path="/register" element={<Register />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/chat" element={<Chat />}/>
           </Route>
         </Routes>

  )
}

export default App
