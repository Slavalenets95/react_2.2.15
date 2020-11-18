import React from 'react';
import './poster-list.css';
import Poster from '../poster';
import NotFoundMovie from '../notFoundMovie';
export default class PosterList extends React.Component {
  getPosters = (postersData) => {
    return postersData.map((posterData) => {
      const genresData = posterData.genresIds.map((item) => ({ text: this.props.genres[item], id: item }));
      return (
        <Poster
          key={posterData.id}
          {...posterData}
          setRatingPoster={this.props.setRatingPoster}
          genresData={genresData}
        />
      );
    });
  };
  render() {
    const posters = this.getPosters(this.props.postersData);
    if (posters.length === 0) return <NotFoundMovie />;
    return <ul className="poster-list">{posters}</ul>;
  }
}
