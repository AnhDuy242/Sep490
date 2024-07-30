// import React, { createContext, useState, useEffect } from 'react';
// import {jwtDecode} from 'jwt-decode';

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [token, setToken] = useState(null);
//   const [role, setRole] = useState(null);
//   const [nameId,setNameId]=useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
//     if (storedToken && storedTokenTimestamp) {
//       const currentTime = new Date().getTime();
//       const tokenAge = currentTime - parseInt(storedTokenTimestamp);
//       if (tokenAge < 3600000) { // 1 hour in milliseconds
//         setToken(storedToken);
//         setIsLoggedIn(true);
//         const decoded = jwtDecode(storedToken);
//         setRole(decoded.role);
        
//       } else {
//         handleTokenExpiration();
//       }
//     }
//   }, []);

//   const updateToken = (newToken) => {
//     setToken(newToken);
//     setIsLoggedIn(true);
//     const decoded = jwtDecode(newToken);
//     setRole(decoded.role);
//     localStorage.setItem('nameId',decoded.nameId );

//     localStorage.setItem('token', newToken);
//     localStorage.setItem('tokenTimestamp', new Date().getTime().toString());
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('tokenTimestamp');
//     localStorage.removeItem('accountId');
//     localStorage.removeItem('role');
//     setToken(null);
//     setIsLoggedIn(false);
//     setRole(null);
//   };

//   const handleTokenExpiration = () => {
//     logout();
//   };

//   const authContextValue = {
//     isLoggedIn,
//     token,
//     role,
//     updateToken,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={authContextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthProvider, AuthContext };
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Đảm bảo bạn đã import đúng

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [nameId, setNameId] = useState(null);
  const [check, setCheck] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
    if (storedToken && storedTokenTimestamp) {
      const currentTime = new Date().getTime();
      const tokenAge = currentTime - parseInt(storedTokenTimestamp);
      if (tokenAge < 3600000) { // 1 hour in milliseconds
        setToken(storedToken);
        setIsLoggedIn(true);
        const decoded = jwtDecode(storedToken);
        console.log('Decoded token on load:', decoded); // Kiểm tra giá trị token đã giải mã
        setRole(decoded.role);
        setNameId(decoded.nameId);
        setCheck(decoded.Check); // Đảm bảo bạn sử dụng đúng key từ token
      } else {
        handleTokenExpiration();
      }
    }
  }, []);

  const updateToken = (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
    const decoded = jwtDecode(newToken);
    console.log('Decoded token on update:', decoded); // Kiểm tra giá trị token đã giải mã
    setRole(decoded.role);
    setNameId(decoded.nameId);
    setCheck(decoded.Check); // Đảm bảo bạn sử dụng đúng key từ token

    localStorage.setItem('nameId', decoded.nameId);
    localStorage.setItem('token', newToken);
    localStorage.setItem('tokenTimestamp', new Date().getTime().toString());
    localStorage.setItem('check', decoded.Check); // Đảm bảo bạn lưu đúng key vào localStorage
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    localStorage.removeItem('accountId');
    localStorage.removeItem('role');
    localStorage.removeItem('check');
    localStorage.removeItem('nameId'); // Xóa nameId khỏi localStorage
    setToken(null);
    setIsLoggedIn(false);
    setRole(null);
    setNameId(null); // Reset nameId state
    setCheck(null); // Reset check state
  };

  const handleTokenExpiration = () => {
    logout();
  };

  const authContextValue = {
    isLoggedIn,
    token,
    role,
    nameId, // Thêm nameId vào context value
    check,
    updateToken,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
