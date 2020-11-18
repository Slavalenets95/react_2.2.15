import React from 'react';
import ReactDOM from 'react-dom';
import PosterList from './components/poster-list';
import Header from './components/header';
import _ from 'lodash';
import SwapiService from './services/swapiservice';
import { Spin } from 'antd';
import { Pagination } from 'antd';
import { Alert } from 'antd';
import 'antd/dist/antd.min.css';

class App extends React.Component {
  swapiService = new SwapiService();
  state = {
    postersData: [],
    totalPages: '',
    genres: {},
    searchQuery: 'return',
    loading: true,
    error: { status: false, message: '' },
    currentTab: 'search',
  };

  componentDidMount() {
    this.swapiService.setSessionID();
    this.setMovieGenres();
    this.updatePosters();
  }

  onError = (err) => {
    this.setState({
      error: { status: true, message: err.message },
      loading: false,
    });
  };

  setRatingPoster = (id, rating) => {
    this.swapiService.setRatingPoster(id, rating).catch((e) => this.onError(e));
    if (!localStorage.getItem(`movie-${id}`)) localStorage.setItem(`movie-${id}`, rating);
  };

  setMovieGenres = () => {
    this.swapiService.getGenres().then((genres) => this.setState({ genres: genres }));
  };
  updatePosters(tab = 'search', searchQuery = 'return', page = 1) {
    this.setState({ currentTab: tab });
    if (tab === 'search')
      this.swapiService
        .getPostersObj(searchQuery, page)
        .then(this.onPostersLoaded)
        .catch((e) => this.onError(e));
    if (tab === 'rated')
      this.swapiService
        .getRatedPostersObj(page)
        .then(this.onPostersLoaded)
        .catch((e) => this.onError(e));
  }
  onPostersLoaded = (postersObj) => {
    this.setState({
      postersData: postersObj.results,
      totalPages: postersObj.totalPages,
      loading: false,
    });
  };
  onSearch = _.debounce((query) => {
    if (query) {
      this.setState({ loading: true, searchQuery: query });
      this.updatePosters('search', query, 1);
    }
  }, 300);
  pagination = (page) => {
    this.updatePosters(this.state.currentTab, this.state.searchQuery, page);
  };
  onSwitchTab = (event) => {
    const tab = event.target.textContent.toLowerCase();
    if (this.state.currentTab === tab) return;
    this.updatePosters(tab);
  };
  render() {
    const { loading, error, totalPages, genres, currentTab } = this.state;
    const hasTrue = !error.status && !loading;
    const spin =
      loading === hasTrue ? (
        <div className="spin-container">
          <Spin size="large" />
        </div>
      ) : null;

    const err = error.status === true ? <Alert banner={true} message={error.message} /> : null;
    return (
      <>
        <Header currentTab={currentTab} onSwitchTab={this.onSwitchTab} onSearch={this.onSearch} />
        <section className="content">
          {spin}
          {hasTrue ? (
            <PosterList postersData={this.state.postersData} setRatingPoster={this.setRatingPoster} genres={genres} />
          ) : null}
          {err}
        </section>
        <footer className="footer">
          <Pagination
            defaultCurrent={1}
            total={totalPages}
            showSizeChanger={false}
            hideOnSinglePage={true}
            defaultPageSize={1}
            onChange={(page) => this.pagination(page)}
          />
        </footer>
      </>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('main'));
export default App;
