import { format } from 'date-fns';

import noPoster from './noPoster.svg';

export default class MovieService {
  _baseUrl = 'https://api.themoviedb.org/3';
  _apiKey = 'api_key=5bf0b9fe943305154eb08e9564cfba0f';

  async getResource(url) {
    try {
      const res = await fetch(`${this._baseUrl}${url}${this._apiKey}`);

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(`Cound not fetch ${this._baseUrl}${url}${this._apiKey} recieved ${res.status}`);
      }
    }
    catch {
      console.log('Ошибка запроса данных!')
    }
  }

  async getPopularMovies(page) {
    const res = await this.getResource(`/movie/popular?page=${page}&`);

    return res.results.map((el) => this.movieData(el));
  }

  async getMovieByWord(word, page) {
    const res = await this.getResource(`/search/movie?query=${word}&page=${page}&`);
    const items = res.results.map((el) => this.movieData(el))
    return {
      data: items,
      totalPages: res.total_pages
    };
  }

  dateFormat(date) {
    if (date) {
      return format(new Date(date), 'MMMM dd, yyyy');
    } else {
      return 'Is unknown'
    }
  }

  hasPoster(poster) {
    return poster ? `https://image.tmdb.org/t/p/original${poster}` : noPoster;
  }

  movieData(movie) {
    return {
      id: movie.id,
      title: movie.title,
      rating: movie.vote_average.toFixed(1),
      date: this.dateFormat(movie.release_date),
      genre: ['Action', 'Drama'],
      description: movie.overview,
      poster: this.hasPoster(movie.poster_path),
    };
  }
}
