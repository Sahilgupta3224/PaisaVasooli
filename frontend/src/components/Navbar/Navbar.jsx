import React, { useState,useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes,faUser } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom'
import 'tailwindcss/base.css'; 
import 'tailwindcss/components.css'; 
import 'tailwindcss/utilities.css'; 
import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import ToggleBtn from './ToggleBtn.jsx';

import Profile from '../../pages/Profile/Profile.jsx';
import { FaRegEnvelope } from "react-icons/fa";
import Inbox from '../../pages/Inbox/inbox.jsx'

function Navbar({thememode,toggle,setUser,user,setFlag,flag}) {
  const [navuser,setNavuser] = useState({})
 
  // ------------ hook to handle the user details ------------------ 
  useEffect(()=>{
    const check=async()=>{
      try{
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          console.log(loggedInUser);
          const foundUser = JSON.parse(loggedInUser);
          console.log("found user",foundUser  )
          setNavuser(foundUser)
          await setUser(foundUser);
        }
      }catch(err){
        console.log(err)
      }
    }
    check()
  },[user?._id,flag])

  // console.log(navuser)
  console.log(user);
  const [showNav, setShowNav] = useState(false);
  // const [isLoggedin,setIsloggedIn]=useState(true)
  // console.log(thememode)
  const navigate=useNavigate()
  
  //  ------------- function to logout ----------------------- 
  const handleLogout = () => {
  //   console.log("User before logout:", user);
  //   setUser({});
  //   console.log("User after logout:", user);
    localStorage.clear();
    navigate('/login');
  };
  
  

  function Logout() {
    localStorage.clear();
    navigate('/login');
  }

  

  return (
    <div className="flex gap-30 justify-between items-center bg-[#8656cd] navbar-parent">
      {/* ------------------ wesite name -------------------  */}
         <div className='text-2xl mx-2 text-white font-extrabold paisa'>
            Paisa Vasooli
        </div>
          

      <div className={showNav ? " flex justify-between gap-12 p-4 text-white content-link active":"flex justify-evenly gap-12 p-4 text-white content-link"} >

  
        <div className="font-bold text-white hover:cursor-pointer relative" onClick={()=>{navigate("/dashboard")}}>
        DashBoard
        </div>

        <div className="font-bold text-white hover:cursor-pointer" onClick={()=>{navigate("/dues")}}>Dues</div>
        <div className="font-bold text-white hover:cursor-pointer " onClick={()=>{navigate("/groups")}}>Groups</div>
        <div className="font-bold text-white hover:cursor-pointer " onClick={()=>{navigate("/savings")}}>Savings</div>
        <div className="font-bold text-white hover:cursor-pointer " onClick={()=>{navigate("/charts")}}>Charts</div>
        <div className="font-bold text-white hover:cursor-pointer " onClick={()=>{navigate("/stocks")}}>Stocks</div>
        <div className="font-bold text-white hover:cursor-pointer " onClick={()=>{navigate("/vault")}}>Vault</div>
        <div className="font-bold text-white hover:cursor-pointer lg:hidden" onClick={()=>{navigate("/inbox")}}>Inbox</div>
        <div className="inside font-bold text-white hover:cursor-pointer " onClick={()=>{Logout()}}>Logout</div>
        <div className="inside2 font-bold text-white hover:cursor-pointer " onClick={toggle} >Theme Toggle</div>
        
      </div>
      <div className="logout absolute border border-white rounded-md p-2 right-1 font-bold text-white hover:cursor-pointer hover:border-gray-300 hover:shadow-xl" onClick={handleLogout}>
  Logout
</div>
        
    <div className='w-[20em] flex justify-evenly items-center icon-bar'>


 {/* ----------------- buttons + toggle ----------------  */}
<div className='w-fit relative top-4 right-1 toggle-nav'>
  <ToggleBtn  thememode={thememode} toggle={toggle} /> 
</div>
<div className='font-bold text-white hover:cursor-pointer border-1 border-white p-3 profileIcon envelop' onClick={()=>{navigate("/inbox")}}>

<FaRegEnvelope className="text-white cursor-pointer" />

</div>

<div className='font-bold text-white hover:cursor-pointer p-3 profileIcon ' onClick={()=>{navigate("/profile")}}>
  <img src={navuser?.image || 'ProfileImg.jpeg'} className='w-[50px] h-[50px]  rounded-full'></img>
</div>




<div className="icons" style={{color:thememode==="dark"?"white":"black"}}>
<div
  className={showNav ? 'icon-menu activemenu' : 'icon-menu'}
  onClick={() => setShowNav(!showNav)}
  
>
  <FontAwesomeIcon icon={faBars} size="xl" />
</div>

<div
  className={showNav ? 'icon-crossX activeman' : 'icon-crossX'}
  onClick={() => setShowNav(!showNav)}
>
  <FontAwesomeIcon icon={faTimes} size="xl" />
</div>
</div>
</div>
</div>
  );
}

export default Navbar;