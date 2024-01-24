import { Component } from 'react';
import './MovieList.css';
import { Alert, Row, Spin } from 'antd';

import SearchError from '../SearchError/SearchError';
import MovieItem from '../MovieItem/MovieItem';
import MovieService from '../../Services/MovieService';

export default class MovieList extends Component {
  movieService = new MovieService();

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      searchError: false,
      isLoaded: false,
      items: [],
    };
  }

  onError = () => {
    this.setState({
      searchError: true,
      isLoaded: true
    })
  }

  componentDidMount() {
    this.movieService.getMovieByWord('spider man').then(
      (movie) => {
        if (movie.length === 0) {
          throw new Error()
        }
        this.setState({
          isLoaded: true,
          items: movie,
        });
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

  render() {
    const { error, isLoaded, items, searchError } = this.state;
    console.log(items);

    const elements = items.map((el) => {
      const { id, ...elProps } = el;
      return <MovieItem key={id} {...elProps} />;
    });

    const networkError = error ?
      <Alert
        message="Запрос данных отклонен. Попробуйте подключить VPN"
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
          <Row
            gutter={[36, 36]}
            justify="space-between"
            style={{
              boxSizing: 'border-box',
              margin: 0,
              padding: '21px 36px',
            }}
          >
            {elements}
            {onSearchError}
            {networkError}
            {loading}
          </Row>
        </div>
      );
    }
  
}
