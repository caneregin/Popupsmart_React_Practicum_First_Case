import React, { useState } from 'react'
import "../Navi.css"

function Navi() {
    // user state olarak tanımlanmıştır.
    const [user, setUser] = useState("")
    // butona tıklandığında local storage toDoUser değerinde veriyi tutar ve sayfa yenilenir
    const handleUser =()=>{
        localStorage.setItem("toDoUser", user);
        window.location.reload(false);
    }
  return (
    <div className='navi'>
        {/* Eğer kullanıcı yoksa form görünür var ise kullanici ismi görünür */}
        {localStorage.getItem("toDoUser") === null ?
        <div className='navi-user'>
        <span>Kullanıcı ismi</span>&nbsp;
        <input value={user} onChange={(e)=> setUser(e.target.value)} />&nbsp;
        <button className='button-save' onClick={handleUser}>Kaydet</button>
        </div>
        :
        <div className='navi-user'>Hoşgeldin {localStorage.getItem("toDoUser")}</div> 
    }
    </div>
  )
}

export default Navi