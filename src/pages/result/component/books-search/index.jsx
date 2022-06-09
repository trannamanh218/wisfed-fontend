import './books-search.scss';
import AuthorBook from 'shared/author-book';
import { CHECK_STAR, CHECK_SHARE } from 'constants';
import ResultNotFound from '../result-not-found';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BookSearch = ({ isFetching, value, setIsFetching, searchResultInput, activeKeyDefault, updateBooks }) => {
	const [listArrayBooks, setListArrayBooks] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [count, setCount] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const dispatch = useDispatch();
	const callApiStartBooks = useRef(0);
	const callApiPerPage = useRef(10);

	useEffect(() => {
		if (activeKeyDefault === 'books') {
			setListArrayBooks([]);
			callApiStartBooks.current = 0;
			setHasMore(true);
		}
	}, [updateBooks, isShowModal, activeKeyDefault]);

	useEffect(() => {
		if (
			activeKeyDefault === 'books' &&
			callApiStartBooks.current === 0 &&
			listArrayBooks.length === 0 &&
			searchResultInput.length > 0
		) {
			handleGetBooksSearch();
		}
	}, [callApiStartBooks.current, value, isShowModal, listArrayBooks]);

	const handleGetBooksSearch = async () => {
		setIsFetching(true);
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStartBooks.current,
				limit: callApiPerPage.current,
			};

			const result = await dispatch(getFilterSearch(params)).unwrap();
			setCount(result.count);
			if (result.rows.length > 0) {
				callApiStartBooks.current += callApiPerPage.current;
				setListArrayBooks(listArrayBooks.concat(result.rows));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<div className='bookSearch__container'>
			<div className='bookSearch__title'>
				{count > 0 && `Trang 1 trong số khoảng ${count} kết quả (0,05 giây)`}
			</div>

			<>
				{listArrayBooks.length && activeKeyDefault === 'books' ? (
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
					isFetching === false && <ResultNotFound />
				)}
			</>
		</div>
	);
};

BookSearch.propTypes = {
	reload: PropTypes.bool,
	setIsFetching: PropTypes.func,
	activeKeyDefault: PropTypes.string,
	searchResultInput: PropTypes.string,
	value: PropTypes.string,
	updateBooks: PropTypes.bool,
	isFetching: PropTypes.bool,
};

export default BookSearch;
