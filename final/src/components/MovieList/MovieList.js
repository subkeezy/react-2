import { Component } from 'react';
import './MovieList.css';
import { Alert, Row, Spin } from 'antd';

import SearchError from '../SearchError/SearchError';
import MovieItem from '../MovieItem/MovieItem';
import MoviePagination from '../MoviePagination/MoviePagination';

export default class MovieList extends Component {

  render() {
    const { error, isLoaded, items, searchError, popularMovies } = this.props.state;
    const { onPageChange, totalPages, onRatingChange, getRatedMovies} = this.props;
    const elements = items.map((el) => {
      return <MovieItem key={el.id} {...el} onRatingChange={onRatingChange}/>;
    });
    const pagination = !error && !searchError && isLoaded && items.length === 20 ? 
      <MoviePagination
        state={this.props.state}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
      : null

    const popularMoviesTitle = popularMovies && !error && !getRatedMovies ? <h1 style={{margin: 0, paddingTop: 20}}>Popular movies</h1> : null

    const networkError = error ?
      <Alert
        message="Запрос данных отклонен. Попробуйте позже."
        type='error'
        showIcon
        style={{
        margin: 'auto',
        textAlign: 'center',
        fontSize: 20,
      }}
    /> : null;

    const onSearchError = searchError ? <SearchError /> : null;
    const loading = !isLoaded ?
      <div
        style={{
          fontSize: 20,
          paddingTop: 20,
          textAlign: 'center'
        }}
      >
      Загрузка <Spin />
      </div> : null;

      return (
        <div className="movie__list">
          {popularMoviesTitle}
          {onSearchError}
          {networkError}
          {loading}
          <Row className='list_grid'
            gutter={[36, 23]}
            style={{
              boxSizing: 'border-box',
              margin: 0,
              paddingTop: 21
            }}
          > 
            {elements}
          </Row>
          {pagination}
        </div>
      );
    }
  
}
