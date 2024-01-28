import { Component } from 'react';
import './MovieList.css';
import { Alert, Row, Spin } from 'antd';

import SearchError from '../SearchError/SearchError';
import MovieItem from '../MovieItem/MovieItem';
import MoviePagination from '../MoviePagination/MoviePagination';

export default class MovieList extends Component {

  render() {
    const { error, isLoaded, items, searchError, popularMovies } = this.props.state;
    const { onPageChange, totalPages } = this.props;
    const elements = items.map((el) => {
      const { id, ...elProps } = el;
      return <MovieItem key={id} {...elProps} />;
    });
    const pagination = !error && !searchError && isLoaded && items.length === 20 ? 
      <MoviePagination
        state={this.props.state}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
      : null

    const popularMoviesTitle = popularMovies ? <h1 style={{margin: 0, paddingTop: 20}}>Popular movies</h1> : null

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
          marginLeft: '45%',
          marginTop: '20%',
          fontSize: 20,
          display: 'flex',
          columnGap: 15,
        }}
      >
      Загрузка <Spin />
      </div> : null;

      return (
        <div className="movie__list">
          {popularMoviesTitle}
          <Row
            gutter={[36, 30]}
            justify="space-between"
            style={{
              boxSizing: 'border-box',
              margin: 0,
              paddingTop: 21
            }}
          > 
            {elements}
            {onSearchError}
            {networkError}
            {loading}
          </Row>
          {pagination}
        </div>
      );
    }
  
}
