import SearchField from 'shared/search-field';
import './main-reading-author.scss';
import { StarAuthor, ShareAuthor } from 'components/svg';
import { useParams } from 'react-router-dom';
import { getBookAuthorList } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import _ from 'lodash';

const MainReadingAuthor = ({ currentUserShelveData }) => {
	const [booksByAuthor, setBooksByAuthor] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [filter, setFilter] = useState('[]');

	const { userId } = useParams();

	const dispatch = useDispatch();

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	useEffect(() => {
		getBooksByAuthorFirsttime();
	}, []);

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
				sort: JSON.stringify([{ 'direction': 'DESC', 'property': 'createdAt' }]),
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

	return (
		<div className='main-reading-author__container'>
			{!_.isEmpty(currentUserShelveData) && (
				<>
					<div className='main-reading-author__header'>
						<h4>{`Sách của ${currentUserShelveData?.isMine ? 'tôi' : currentUserShelveData.fullName}`}</h4>
						<SearchField
							placeholder='Tìm kiếm sách'
							className='main-shelves__search'
							// handleChange={handleSearch}
							// value={inputSearch}
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
								dataLength={booksByAuthor.length}
								next={getBooksByAuthor}
								hasMore={hasMore}
								loader={<LoadingIndicator />}
							>
								{booksByAuthor.map(item => (
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
											<div className='main-reading-author__books__item__under'>
												{item.newReview.length} lượt review mới
											</div>
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
											<div className='main-reading-author__books__item__under'>
												{item.newQuote.length} lượt quote mới
											</div>
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
				</>
			)}
		</div>
	);
};
export default MainReadingAuthor;
