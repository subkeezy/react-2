import { Tabs } from 'antd';
import { Component } from 'react';

import MovieList from "../MovieList/MovieList";
import MovieSearch from '../MovieSearch/MovieSearch';
import MovieService from '../../Services/MovieService';
import './MovieTabs.css'

export default class MovieTabs extends Component {

  movieService = new MovieService();

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      searchError: false,
      isLoaded: false,
      items: [],
      noValue: null,
      popularMovies: null,
      inputValue: null,
      totalPages: null,
      currentPage: 1
    };
  }

  movieState(error, searchError, isLoaded, items, noValue, popularMovies, inputValue, totalPages, currentPage) {
    this.setState({
      error: error,
      searchError: searchError,
      isLoaded: isLoaded,
      items: items,
      noValue: noValue,
      popularMovies: popularMovies,
      inputValue: inputValue,
      totalPages: totalPages,
      currentPage: currentPage
    })
  }

  onError = () => {
    this.movieState(null, true, true, [], null, null, null, null, null)
  }

  componentDidMount() {
    const {currentPage} = this.state;
    this.onEmptyInput(currentPage)
  }

  onEmptyInput(page) {
    this.movieService.getPopularMovies(page).then(
      (items) => {
        this.movieState(null, null, true, items, null, true, null, 20, page)
        if (items.length === 0) {
          throw new Error()
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    )
    .catch((err) => this.onError(err))
  }

  onMovieSearch = (input, page) => {
    this.movieService.getMovieByWord(input, page).then(
      (items) => {
        if (input.length === 0) {
          this.movieState(null, null, true, [], this.onEmptyInput(page), null, null, null, null)
        } else if (items.data.length === 0) {
          this.movieState(null, null, true, [], null, null, null, null, null)
          throw new Error('Фильмов не найдено')
        } else {
          this.movieState(null, null, true, items.data, null, null, input, items.totalPages, page) 
        }

      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    )
    .catch((err) => this.onError(err))
  }

  onPageChange(page) {
    const {inputValue, popularMovies} = this.state
    this.setState({
      currentPage: page,
    })
    popularMovies ? this.onEmptyInput(page) : this.onMovieSearch(inputValue, page);
  }

  render() {
    const { totalPages } = this.state;
    return (
      <div className='movie-tabs'>
        <Tabs centered>
          <Tabs.TabPane tab="Search" key={1}>
            <MovieSearch
              state={this.state} 
              onMovieSearch={this.onMovieSearch.bind(this)}
            />
            <MovieList 
              state={this.state}  
              onPageChange={this.onPageChange.bind(this)}
              totalPages={totalPages}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Rated" key={2}>
            <p>Rated</p>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}
