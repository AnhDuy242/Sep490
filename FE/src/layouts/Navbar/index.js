import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [searchValue, setSearchValue] = useState(''); // State for search input value

  // Function to handle mouse enter event for dropdown
  const handleDropdownToggle = () => {
    setShowDropdown(true);
  };

  // Function to handle mouse leave event for dropdown
  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  // Function to handle change in search input
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Function to handle search button click
  const handleSearchClick = () => {
    // Perform search functionality here, e.g., navigate to search results page
    console.log('Search clicked with value:', searchValue);
  };

  return (
    <header className="header">
      <nav className="nav container-navbar">
        <div className="nav__menu">
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink to="/" className="nav__link">
                Trang chủ
              </NavLink>
            </li>
            <li className="nav__item">
              <a
                className="nav__link"
                onMouseEnter={handleDropdownToggle}
               
              >
                Chuyên khoa & Dịch vụ
                {showDropdown && (
                  <div className="dropdown-content">
                    <NavLink to="/category1" className="dropdown-link">
                      Category 1
                    </NavLink>
                    <NavLink to="/category2" className="dropdown-link">
                      Category 2
                    </NavLink>
                  </div>
                )}
              </a>
            </li>
            <li className="nav__item">
              <NavLink to="/about-us" className="nav__link">
                Giới thiệu
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/doctor" className="nav__link">
                Đội ngũ bác sĩ
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/contact" className="nav__link">
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
              <button
                className="nav__search-button"
                onClick={handleSearchClick}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
