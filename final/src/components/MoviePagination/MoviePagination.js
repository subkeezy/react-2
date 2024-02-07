import { Pagination } from "antd"

import './MoviePagination.css'

const MoviePagination = (props) => {
  const {onPageChange, totalPages} = props;

  return (
    <div className="movie-pagination">
      <Pagination defaultCurrent={1} showSizeChanger={false} total={totalPages} onChange={onPageChange} defaultPageSize={1}/>
    </div>
  )
}

export default MoviePagination;