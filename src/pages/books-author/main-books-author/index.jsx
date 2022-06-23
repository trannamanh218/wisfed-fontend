import SearchField from 'shared/search-field';
import './main-reading-author.scss';
import { StarAuthor, ShareAuthor } from 'components/svg';
import { useParams } from 'react-router-dom';
import { getBookAuthorList } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import PropTypes from 'prop-types';
import { getFilterSearch } from 'reducers/redux-utils/search';
import _ from 'lodash';
import { Link } from 'react-router-dom';
const MainBooksAuthor = ({ shelveGroupName }) => {
	const [booksByAuthor, setBooksByAuthor] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [filter, setFilter] = useState('[]');
	const [inputSearch, setInputSearch] = useState('');
	const { userId } = useParams();

	const dispatch = useDispatch();

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	useEffect(() => {
		if (filter === '[]') {
			getBooksByAuthorFirsttime();
		}
	}, [filter]);

	const getBooksByAuthorFirsttime = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
				filter: '[]',
				sort: JSON.stringify([{ 'direction': 'DESC', 'property': 'createdAt' }]),
			};
			const data = await dispatch(getBookAuthorList({ id: userId, params: params })).unwrap();
			setBooksByAuthor(data);
			if (!data.length || data.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getBooksByAuthor = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				filter: filter,
				sort: JSON.stringify([{ 'created_at': { 'order': 'desc' } }]),
			};
			const data = await dispatch(getBookAuthorList({ id: userId, params: params })).unwrap();
			if (data.length) {
				if (data.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setBooksByAuthor(booksByAuthor.concat(data));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const updateFilter = value => {
		if (value) {
			const filterValue = value.trim();
			setFilter(filterValue);
		} else {
			setFilter('[]');
		}
	};
	useEffect(() => {
		if (inputSearch.length > 0) {
			fetchDataSearch();
		}
	}, [filter]);

	const fetchDataSearch = async () => {
		const params = {
			authorId: userId,
			type: 'books',
			q: filter,
			sort: JSON.stringify([{ 'created_at': { 'order': 'desc' } }]),
		};
		try {
			if (filter) {
				const data = await dispatch(getFilterSearch(params)).unwrap();
				setBooksByAuthor(data.rows);
			}
		} catch (err) {
			NotificationError(err);
		}
	};
	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};
	const debounceSearch = useCallback(_.debounce(updateFilter, 1000), []);

	return (
		<div className='main-reading-author__container'>
			<div className='main-reading-author__header'>
				<h4>{shelveGroupName}</h4>
				<SearchField
					placeholder='Tìm kiếm sách'
					className='main-shelves__search'
					handleChange={handleSearch}
					value={inputSearch}
				/>
			</div>

			<div className='main-reading-author__books'>
				<div className='main-reading-author__books__title'>
					<div></div>
					<div className='main-reading-author__books__column'>Tên sách</div>
					<div className='main-reading-author__books__column'>Sao trung bình</div>
					<div className='main-reading-author__books__column'>Lượt đánh giá</div>
					<div className='main-reading-author__books__column'>Lượt review</div>
					<div className='main-reading-author__books__column'>Lượt thêm sách</div>
					<div className='main-reading-author__books__column'>Lượt quote</div>
					<div></div>
				</div>
				<div className='main-reading-author__books__content'>
					<InfiniteScroll
						dataLength={booksByAuthor?.length}
						next={getBooksByAuthor}
						hasMore={hasMore}
						loader={<LoadingIndicator />}
					>
						{booksByAuthor?.map(item => (
							<div key={item.id} className='main-reading-author__books__item'>
								<div className='main-reading-author__books__item__column book-image'>
									<img src={item.images[1]} alt='book-image' />
								</div>
								<div className='main-reading-author__books__item__column book-name'>
									<span>{item.name}</span>
								</div>
								<div className='main-reading-author__books__item__column'>
									<div className='main-reading-author__books__item__top'>
										<span>{item.countRating}</span>
										<StarAuthor />
									</div>
									<div className='main-reading-author__books__item__under'></div>
								</div>
								<div className='main-reading-author__books__item__column'>
									<div className='main-reading-author__books__item__top'>
										<span>{item.countRating}</span>
									</div>
									<div className='main-reading-author__books__item__under'></div>
								</div>
								<div className='main-reading-author__books__item__column'>
									<div className='main-reading-author__books__item__top'>
										<span className='underline-and-gold-color'>{item.countReview}</span>
									</div>
									<Link
										to={`/book/detail/${item.id} `}
										className='main-reading-author__books__item__under'
									>
										{item.newReview} lượt review mới
									</Link>
								</div>
								<div className='main-reading-author__books__item__column'>
									<div className='main-reading-author__books__item__top'>
										<span>{item.countAddBook}</span>
									</div>
									<div className='main-reading-author__books__item__under'></div>
								</div>
								<div className='main-reading-author__books__item__column'>
									<div className='main-reading-author__books__item__top'>
										<span className='underline-and-gold-color'>{item.countQuote}</span>
									</div>
									<Link
										to={`/book/detail/${item.id} `}
										className='main-reading-author__books__item__under'
									>
										{item.newQuote} lượt quote mới
									</Link>
								</div>
								<div className='main-reading-author__books__item__column'>
									<ShareAuthor />
								</div>
							</div>
						))}
					</InfiniteScroll>
				</div>
			</div>
			<button className='main-reading-author__share-btn btn'>Chia sẻ</button>
		</div>
	);
};

MainBooksAuthor.propTypes = {
	shelveGroupName: PropTypes.string,
};

export default MainBooksAuthor;
