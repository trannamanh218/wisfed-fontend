import './books-search.scss';
import AuthorBook from 'shared/author-book';
import { CHECK_STAR, CHECK_SHARE } from 'constants';
import ResultNotFound from '../result-not-found';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Circle from 'shared/loading/circle';

const BookSearch = ({ listArrayBooks, hasMore, handleGetBooksSearch, count, isFetching }) => {
	return (
		<div className='bookSearch__container'>
			<div className='bookSearch__title'>
				{count > 0 && `Trang 1 trong số khoảng ${count} kết quả (0,05 giây)`}
			</div>

			<>
				{listArrayBooks?.length > 0 ? (
					<InfiniteScroll
						next={handleGetBooksSearch}
						dataLength={listArrayBooks.length}
						hasMore={hasMore}
						loader={<Circle loading={isFetching} />}
					>
						{listArrayBooks.map(item => (
							<div key={item.id} className='bookSearch__main'>
								<AuthorBook data={item} checkStar={CHECK_STAR} checkshare={CHECK_SHARE} />
							</div>
						))}
					</InfiniteScroll>
				) : (
					<ResultNotFound />
				)}
			</>
		</div>
	);
};

BookSearch.propTypes = {
	listArrayBooks: PropTypes.array,
	hasMore: PropTypes.bool,
	handleGetBooksSearch: PropTypes.func,
	count: PropTypes.number,
	isFetching: PropTypes.bool,
};

export default BookSearch;
