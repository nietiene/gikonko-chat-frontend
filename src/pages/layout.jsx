import { Outlet, Link, useNavigate } from "react-router-dom";
import  { FaHome, FaEnvelope, FaBell, FaUserCircle } from "react-icons/fa";
import api from "../api";
import { useEffect, useState } from "react";

export default function Layout () {

        const [showUserMenu, setShowUserMenu] = useState(false);
        const [profileImage, setProfileImage] = useState(null);
        const [selectedFile, setSelectedFile] = useState(null);

        //handling badges
        const [unreadMesages, setUnreadMessages] = useState(0);
        const [unreadNotifications, setUnreadNotifications] = useState(0);
        const [user, setUser] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
            if (!user) return;

            const fetchUnreadCountsForMessages = async () => {
                try {
                    const res = api.get(`/api/messages/unread/${user.name}`);
                    const totalUnreadMessages = res.data.reduce((sum, msg) => sum + msg.unread_count, 0);
                    setUnreadMessages(totalUnreadMessages);

                } catch (error) {
                    console.error('Error fetching unread counts', error);
                }
            };

            fetchUnreadCountsForMessages();
        }, [user]);
        
       useEffect(() => {
        api.get("/api/auth/profile")
        .then((res) => {
            console.log("Profile", res.data);
            setUser(res.data);
            if (res.data.profile_image) {
                setProfileImage(`http://localhost:4000/uploads/${res.data.profile_image}`)
            }
        }).catch(() => {
            navigate("/");
        })
       }, []);

        const handleFileChange = (e) => {
            if (e.target.files && e.target.files[0]) {
                setProfileImage(URL.createObjectURL(e.target.files[0]));
                setSelectedFile(e.target.files[0]);
            }
        }

        const handleProfilePhotoChange = async (e) => {
            e.preventDefault();

            if (!selectedFile) {
                 alert("Please select an image");
                 return;
            };

            const formData = new FormData();
            formData.append("profile_image", selectedFile);

            try {
                 const response = await api.post("/api/users/change-profile-photo", formData,{
                    headers: { 'Content-Type': 'multipart/form-data'}
                 }, { withCredentials: true},
                );

                if (response.data.profile_image) {
                    setProfileImage(`http://localhost:4000/uploads/${response.data.profile_image}`);
                }
                   setSelectedFile(null);
                   setShowUserMenu(false);
                  alert("Photo changed successfully");
            } catch (error) {
                console.error(error);
                alert("Upload failed" + (error.response?.data?.error));
            }
        }

        const handleLogout = async () => {
            try {
                await api.post("/api/auth/logout");
                navigate("/");
            } catch {
                alert("logout failed");
            }
        }


        // reset badge count when user click on visit the page

        useEffect(() => {
            if (location.pathname === '/chat') setUnreadMessages(0);
            if (location.pathname === '/notifications') setUnreadNotifications(0);
        }, [location.pathname]);


        if (!user) return null;
    return (
          <div className="min-h-screen flex flex-col">
               <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center bg-blue-700 text-white px-6 py-3 shadow">
                <div className="flex gap-6 items-center">
                    <Link className="flex items-center gap-1 hover:underline" to="/dashboard">
                         <FaHome/> Home
                    </Link>
                    <Link className="flex items-center gap-1 hover:underline" to="/chat">
                          <FaEnvelope/> Messages
                    </Link>
                    <Link className="flex items-center gap-1 hover:underline" to="/notifications">
                        <FaBell/> Notification
                    </Link>
                </div>
                
                <button className="relative group bg-white text-blue-500 p-1 rounded-full
                                  font-semibold flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition-all duration-200"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                >
                    {profileImage ? (
                        <>
                           <img src={profileImage} 
                             alt="Profile"
                             className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                            />

                        </>

                    ) : (
                        <FaUserCircle className="text-3xl mb-1"/>
                    )}
                </button>
               </nav>

               {showUserMenu && (
                <div className="absolute top-16 right-2 bg-white border border-gray-200 rounded-lg shadow-xl p-5 w-72 z-50">
                    <div className="mt-2">
                       <h3 className="font-bold text-gray-800 text-lg mb-2">{user.name}</h3>
                 
                       <p className="text-gray-700 mb-1"><span className="font-semibold text-gray-800">Phone: </span>{user.phone}</p>
                       <p className="text-gray-700"><span className="font-semibold text-gray-800">Role: </span>{user.role}</p>
                    </div>
                    <form onSubmit={handleProfilePhotoChange} className="mt-4">
                        <label className="block text-sm mb-2 font-medium text-gray-700 ">Change Profile photo</label>
                        <input type="file"
                           accept="image/*"
                           onChange={handleFileChange}
                           className="block w-full text-sm text-gray-600
                                      file:mr-4 file:py-2 file:px:4
                                      file:rounded-md file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-gray-100 file:text-gray-700
                                      file:hover:bg-gray-200 cursor-pointer mb-4"
                        />

                   <div className="space-y-3">
                        <button type="submit"
                            className=" w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700
                                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm font-semibold"
                       >
                                Upload
                            </button>
                         <button
                         type="button"
                           onClick={handleLogout}
                           className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:red-700 transition-colors
                                      duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm font-semibold"
                        >
                            Logout
                        </button>  
                   </div>
 
                    </form>
                </div>
               )}

            <div className="pt-20 flex-1 overflow-y-auto">
               <Outlet/>
           </div>
    </div>
    )
}

