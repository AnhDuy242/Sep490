    import { useState } from 'react'; // Import useState hook
    import { NavLink } from "react-router-dom";
    import './navbar.css';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faSearch } from '@fortawesome/free-solid-svg-icons';
    import styled, { createGlobalStyle } from 'styled-components';

    const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

    body {
        margin: 0;
        font-family: 'Montserrat', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    `;
      // State để quản lý giá trị tìm kiếm

    const Navbar = () => {
    // State để quản lý trạng thái hiển thị dropdown
    const [showDropdown, setShowDropdown] = useState(false);

    // Hàm để xử lý hover vào mục có dropdown
    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown); // Đảo ngược trạng thái dropdown
    };
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
      };
    
      // Hàm để xử lý sự kiện khi bấm vào nút tìm kiếm
      const handleSearchClick = () => {
        console.log('Searching for:', searchValue);
        // Thực hiện hành động tìm kiếm ở đây
      };
    
    // Hàm để ẩn dropdown khi click vào một nơi nào đó
    const handleDropdownClose = () => {
        setShowDropdown(false);
    };

    return (
        <>
        <GlobalStyle />
        <header className="header">
        <nav className="nav container">
          

            <div className={"nav__menu"} id="nav-menu">
            <ul className="nav__list">
                <li className="nav__item">
                <NavLink to="/" className="nav__link">
                  Trang chủ
                </NavLink>
                </li>
                <li className="nav__item">
                {/* Sử dụng onMouseEnter và onMouseLeave để xử lý dropdown */}
                <NavLink
                    to="/news"
                    className="nav__link"
                    onMouseEnter={handleDropdownToggle}
                    onMouseLeave={handleDropdownClose}
                >
                   Chuyên khoa & Dịch vụ
                    {showDropdown && (
                    <div className="dropdown-content">
                        {/* Các mục dropdown */}
                        <NavLink to="/news/category1" className="dropdown-link">Category 1</NavLink>
                        <NavLink to="/news/category2" className="dropdown-link">Category 2</NavLink>
                    </div>
                    )}
                </NavLink>
                </li>
                <li className="nav__item">
                <NavLink
                    to="/about-us"
                    className="nav__link"
                > Giới thiệu
                </NavLink>
                </li>
                <li className="nav__item">
                <NavLink
                    to="/favorite"
                    className="nav__link"
                >
                    Đội ngũ bác sĩ
                </NavLink>
                </li>
                <li className="nav__item">
                <NavLink
                    to="/location"
                    className="nav__link"
                >
                    Liên hệ
                </NavLink>
                </li>
                <li className="nav__item">
                <NavLink to="/get-started" className="nav__link nav__cta">
                    Bạn có biết?
                </NavLink>
                </li>
                <li className="nav__item nav__search-container">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="nav__search" 
                  value={searchValue} 
                  onChange={handleSearchChange} 
                />
                <button className="nav__search-button" onClick={handleSearchClick}>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </li>
            </ul>
          </div>

        </nav>
        </header>
        </>
    );
    };

    export default Navbar;
