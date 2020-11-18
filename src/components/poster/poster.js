import React from 'react';
import './poster.css';
import noPosterIcon from './noposter.png';
import { Rate } from 'antd';


export default class Poster extends React.Component {
  state = {
    rating: null,
  };

  onChangeRate = (rating) => {
    const { setRatingPoster, id } = this.props;
    setRatingPoster(id, rating);
    this.setState({ rating: rating });
  };

  trim = (str, limit) => {
    let result = [];
    let length = 0;

    str.split(' ').forEach((item) => {
      if (length < limit) {
        length += item.length;
        result.push(item);
      }
    });

    return result.join(' ') + ' ...';
  };

  render() {
    const { title, rating, releaseDate, annotation, posterPath, id } = this.props;
    const globalRatingColor = rating <= 3 ? '#E90000' : rating <= 5 ? '#E97E00' : rating <= 7 ? '#E9D100' : '#66E900';
    return (
      <li className="poster-list__item poster">
        <div className="poster-preview poster__preview">
          {
            <img
              src={posterPath === null ? noPosterIcon : `https://image.tmdb.org/t/p/w185/${posterPath}`}
              alt="Постер к фильму"
              className="poster-preview__img"
            />
          }
        </div>
        <div className="poster-info poster__info">
          <div className="poster-info__header">
            <p className="poster-info__title">{title}</p>
            <p className="poster-info__rating" style={{ borderColor: globalRatingColor }}>
              {rating}
            </p>
          </div>
          <p className="poster-info__date">{releaseDate}</p>
          <ul className="poster-info__list">
            <li className="poster-info__list-item">Action</li>
            <li className="poster-info__list-item">Drama</li>
          </ul>
          <p className="poster-info__annotation">{this.trim(annotation, 100)}</p>
          <Rate
            onChange={this.onChangeRate}
            value={localStorage.getItem(`movie-${id}`) || this.state.rating}
            count={10}
            disabled={localStorage.getItem(`movie-${id}`)}
          />
        </div>
      </li>
    );
  }
}
