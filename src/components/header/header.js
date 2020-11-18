import React from 'react';
import './header.css';
function Header({ onSwitchTab, currentTab, onSearch }) {
  return (
    <header className="header">
      <section className="header__tabs">
        <ul className="header__list" onClick={onSwitchTab}>
          <li
            className={currentTab === 'search' ? 'header__list-item header__list-item_selected' : 'header__list-item'}
          >
            Search
          </li>
          <li className={currentTab === 'rated' ? 'header__list-item header__list-item_selected' : 'header__list-item'}>
            Rated
          </li>
        </ul>
      </section>
      <input
        className="header__search"
        type="text"
        placeholder="Type to search..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </header>
  );
}

export default Header;
