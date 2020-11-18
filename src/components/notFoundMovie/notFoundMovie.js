import React from 'react';
import './notFoundMovie.css';
import icon from './notFoundMovie.png';

function NotFoundMovie() {
  return (
    <div className="error">
      <p className="error__text">Nothing seems to be found</p>
      <img className="error__image" src={icon} alt="error-icon" />
    </div>
  );
}

export default NotFoundMovie;
