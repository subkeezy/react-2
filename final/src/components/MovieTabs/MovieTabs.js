import { Tabs } from 'antd';
import { Component } from 'react';

import MovieList from "../MovieList/MovieList";
import MovieSearch from '../MovieSearch/MovieSearch';
import MovieService from '../../Services/MovieService';
import MovieGenresContext from '../MovieGenresContext/MovieGenresContext';
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
      popularMovies: null,
      inputValue: null,
      totalPages: null,
      currentPage: 1,
      ratedItems: [],
      allGenres: this.getGenres(),
    };
  }

  movieState(error, searchError, isLoaded, items, popularMovies, inputValue, totalPages, currentPage) {
    this.setState({
      error: error,
      searchError: searchError,
      isLoaded: isLoaded,
      items: items,
      popularMovies: popularMovies,
      inputValue: inputValue,
      totalPages: totalPages,
      currentPage: currentPage
    })
  }

  
  componentDidMount() {
    const {currentPage} = this.state;
    this.onEmptyInput(currentPage)
    this.getGenres()
  }

  onError = () => {
    this.movieState(null, true, true, [])
  }

  getGenres() {
    this.movieService.getGenres().then(
      (genres) => {
        this.setState({
          allGenres: genres.genres,
        });
      },
      (error) => {
        this.setState({error})
      }
    )
  }

  onEmptyInput(page) {
    this.movieService.getPopularMovies(page).then(
      (items) => {
        this.movieState(null, null, true, items, true, null, 20, page)
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
          this.setState({
            isLoaded: true,
            items: [],
            inputValue:  this.onEmptyInput(page)
          })
        } else if (items.data.length === 0) {
          this.movieState(null, null, true, [])
          throw new Error('Фильмов не найдено')
        } else {
          this.movieState(null, null, true, items.data, null, input, items.totalPages, page) 
        }

      },
      (error) => {
        this.setState({
          isLoaded: true,
          items: [],
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

  onRatingChange(rating, id) {
        const { items, ratedItems } = this.state;
        const index = ratedItems.findIndex((item) => item.id === id);
        if (index !== -1) {
          ratedItems[index].rating = rating;
        } else {
          const movie = items.find((item) => item.id === id);
          ratedItems.push({
            ...movie,
            rating,
          });
        }
        this.setState({
          ratedItems: [...ratedItems],
        });
        localStorage.setItem('ratedItems', JSON.stringify(this.state.ratedItems));
  }

  
  getRatedMovies() {
    const ratedItems = JSON.parse(localStorage.getItem('ratedItems')) || [];
    this.setState({
      ratedItems: ratedItems,

    });
  }

  render() {
    const { totalPages, allGenres } = this.state;
    console.log(allGenres)
    return (
      <MovieGenresContext.Provider value={allGenres}>
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
                onRatingChange={this.onRatingChange.bind(this)}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Rated" key={2} onChange={this.getRatedMovies.bind(this)}>
              <MovieList
                state={{ ...this.state, items: this.state.ratedItems }}
                onPageChange={this.onPageChange.bind(this)}
                totalPages={totalPages}
                onRatingChange={this.onRatingChange.bind(this)}
                getRatedMovies={this.getRatedMovies.bind(this)}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </MovieGenresContext.Provider>
    )
  }
}
