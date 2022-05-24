import './books-search.scss';
import AuthorBook from 'shared/author-book';
import { CHECK_STAR, CHECK_SHARE } from 'constants';
import ResultNotFound from '../result-not-found';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import _ from 'lodash';

const BookSearch = ({ listArrayBooks, hasMore, handleGetBooksSearch }) => {
	console.log(listArrayBooks);
	return (
		<div className='bookSearch__container'>
			{/* <div className='bookSearch__title'>
				Trang 1 trong số khoảng {listArrayBooks?.count} kết quả (0,05 giây)
			</div> */}

			{listArrayBooks?.length > 0 ? (
				<InfiniteScroll
					next={handleGetBooksSearch}
					dataLength={listArrayBooks.length}
					hasMore={hasMore}
					loader={<LoadingIndicator />}
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
		</div>
	);
};

BookSearch.propTypes = {
	listArrayBooks: PropTypes.object,
	hasMore: PropTypes.bool,
	handleGetBooksSearch: PropTypes.func,
};

export default BookSearch;
