import React from 'react';
import './poster-list.css';
import Poster from '../poster';
import NotFoundMovie from '../notFoundMovie'

export default class PosterList extends React.Component {
  getPosters = (postersData) => {
    return postersData.map((posterData) => {
      let genres = this.props.ganres
      genres = genres.genres.map(item => ({[item.id] : item.name}))
      let a = posterData.genresIds.map(item => genres[item])
      console.log(a)
      
      return <Poster key={posterData.id} {...posterData} setRatingPoster={this.props.setRatingPoster} />;
    });
  };

  render() {
    const posters = this.getPosters(this.props.postersData);
    if(posters.length === 0) return <NotFoundMovie />

    return <ul className="poster-list">{posters}</ul>;
  }
}
