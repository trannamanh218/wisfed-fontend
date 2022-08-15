import './books-search.scss';
import AuthorBook from 'shared/author-book';
import ResultNotFound from '../result-not-found';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'shared/button';
import { Link } from 'react-router-dom';

const BookSearch = ({ isFetching, value, setIsFetching, searchResultInput, activeKeyDefault, updateBooks }) => {
	const [listArrayBooks, setListArrayBooks] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [resultInformations, setResultInformations] = useState({ count: 0, time: 0 });
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
			const startTime = Date.now();
			const result = await dispatch(getFilterSearch(params)).unwrap();
			const doneTime = Date.now();
			const resultInfo = { count: result.count, time: ((doneTime - startTime) / 1000).toFixed(2) };
			setResultInformations(resultInfo);
			if (result.rows.length > 0) {
				callApiStartBooks.current += callApiPerPage.current;
				setListArrayBooks(listArrayBooks.concat(result.rows));
			}
			// Nếu kết quả tìm kiếm nhỏ hơn limit thì disable gọi api khi scroll
			if (!result.rows.length || result.rows.length < params.limit) {
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
			{!!resultInformations.count && (
				<div className='bookSearch__title'>
					Có khoảng {resultInformations.count} kết quả ({resultInformations.time} giây)
				</div>
			)}
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
								<AuthorBook data={item} checkStar={true} position='bookSearch' />
							</div>
						))}
					</InfiniteScroll>
				) : (
					isFetching === false && (
						<>
							<ResultNotFound />
							<div className='btn-goTo-upload-book'>
								<Link to='/upload-book'>
									<Button>Tạo sách mới</Button>
								</Link>
							</div>
						</>
					)
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
