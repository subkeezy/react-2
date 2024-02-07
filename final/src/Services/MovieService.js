import { format } from 'date-fns';

import noPoster from './noPoster.svg';

export default class MovieService {
  _baseUrl = 'https://api.themoviedb.org/3';
  _apiKey = 'api_key=5bf0b9fe943305154eb08e9564cfba0f';
  authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmYwYjlmZTk0MzMwNTE1NGViMDhlOTU2NGNmYmEwZiIsInN1YiI6IjY1YTdhODUxMzg3NjUxMDEyNzFhNGU3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.s1-ZOErGMmz28TFyIN1PjchEHw_2wlILODpKUtJWmGw'


  async getGenres() {
      const res = await this.getResource(`/genre/movie/list?language=en&`);
      return res
  }

  async guestSession() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: this.authorization
      }
    };
    
    const res = await fetch(`${this._baseUrl}/authentication/guest_session/new`, options)
    const jsonRes = await res.json()
    localStorage.clear()
    return localStorage.setItem('id', jsonRes.guest_session_id.toString())
  }

  async rateMovies(rating, id) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: this.authorization
      },
      body: JSON.stringify({value: rating})
    };

    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/rating?guest_session_id=${localStorage.getItem('id')}`, options)
    const jsonRes = await res.json()
    return jsonRes
  }


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
    console.log(res)
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
      rating: 0,
      date: this.dateFormat(movie.release_date),
      genre: movie.genre_ids,
      description: movie.overview,
      poster: this.hasPoster(movie.poster_path),
    };
  }
}