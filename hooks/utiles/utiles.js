
'use client';
import Cookies from "js-cookie";
export const get = (key) => {
    return Cookies.get(key);    
}
export   function removeKey (key)  {
    Cookies.remove(key);
}

export   function isSession  ()  {
    let token = Cookies.get('token');  
    if(token){
        return true;
    } else {
        //console.log(token+" false");
        return false;
    }
    
    return (token && (token != 'undefined' || token != null || token != 'null' || token != undefined ));
}