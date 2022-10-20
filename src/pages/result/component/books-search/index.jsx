import { NotificationError } from 'helpers/Error';
import Storage from 'helpers/Storage';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { getFilterSearch } from 'reducers/redux-utils/search';
import AuthorBook from 'shared/author-book';
import Button from 'shared/button';
import LoadingIndicator from 'shared/loading-indicator';
import ResultNotFound from '../result-not-found';
import './books-search.scss';

const BookSearch = ({ isFetching, value, setIsFetching, searchResultInput, activeKeyDefault, updateBooks }) => {
	const [listArrayBooks, setListArrayBooks] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [resultInformations, setResultInformations] = useState({ count: 0, time: 0 });
	const [hasMore, setHasMore] = useState(true);
	const dispatch = useDispatch();
	const callApiStartBooks = useRef(0);
	const callApiPerPage = useRef(10);

	const navigate = useNavigate();
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

		if (searchResultInput.length === 0) {
			setResultInformations({ count: 0, time: 0 });
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

	const handleDiect = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			navigate('/upload-book');
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
						{listArrayBooks.map((item, index) => (
							<>
								<div key={item.id} className='bookSearch__main'>
									<AuthorBook data={item} checkStar={true} saveLocalStorage={true} />
								</div>
								{index === 9 && (
									<div className='btn-goTo-upload-book has-background'>
										<h6>Vui lòng thêm sách nếu bạn không tìm thấy trên hệ thống</h6>
										<br />
										<Button onClick={handleDiect}>Thêm sách</Button>
									</div>
								)}
							</>
						))}
					</InfiniteScroll>
				) : (
					isFetching === false && (
						<>
							<ResultNotFound />
							<div className='btn-goTo-upload-book'>
								<Button onClick={handleDiect}>Tạo sách mới</Button>
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
