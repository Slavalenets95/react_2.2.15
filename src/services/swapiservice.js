export default class SwapiService {
  _api_key = '8bd9eb86e4d5c985f92cce84597afc72';
  _api_base = 'https://api.themoviedb.org/3/';
  async getResource(url) {
    try {
      const res = await fetch(`${this._api_base}${url}`);
      if (!res.ok) {
        throw new FetchError(`Could not fetch ${url} received ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      if (!navigator.onLine) throw new Error('Ops. Check your network connection.');
      throw new Error('Ops. Something went wrong.');
    }
  }
  async setSessionID() {
    if (!localStorage.getItem('sessionID')) {
      const sessionObj = await this.getResource(`authentication/guest_session/new?api_key=${this._api_key}`);
      if (sessionObj.success) {
        localStorage.setItem('sessionID', sessionObj.guest_session_id);
      }
    }
  }
  getSessionID() {
    if (localStorage.getItem('sessionID')) return localStorage.getItem('sessionID');
  }
  async getGenres() {
    const genres = await this.getResource(`genre/movie/list?api_key=${this._api_key}&language=en-US`);
    const transformGenres = {};
    genres.genres.map((item) => ({ [item.id]: item.name })).forEach((item) => Object.assign(transformGenres, item));
    return transformGenres;
  }
  transformPosters(posters) {
    return posters.map((item) => {
      return {
        id: item.id,
        title: item.title,
        releaseDate: item.release_date,
        annotation: item.overview,
        rating: item.vote_average,
        posterPath: item.poster_path,
        genresIds: item.genre_ids,
      };
    });
  }
  async getPostersObj(query = 'return', page = 1) {
    const { results, total_pages: totalPages } = await this.getResource(
      `search/movie?api_key=${this._api_key}&language=en-US&query=${query}&page=${page}&include_adult=false`
    );
    return {
      results: this.transformPosters(results),
      totalPages: totalPages,
    };
  }
  async getRatedPostersObj(page = 1) {
    const { results, total_pages: totalPages, total_results: totalResults } = await this.getResource(
      `guest_session/${this.getSessionID()}/rated/movies?api_key=${this._api_key}&language=en-US&sort_by=created_at.asc`
    );
    return {
      results: this.transformPosters(results),
      totalPages: totalPages,
      totalResults: totalResults,
    };
  }
  async setRatingPoster(id, rating) {
    await fetch(
      `${this._api_base}movie/${id}/rating?api_key=${this._api_key}&guest_session_id=${this.getSessionID()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    );
  }
}
class FetchError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FetchError';
  }
}
