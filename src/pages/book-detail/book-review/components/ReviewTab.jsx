import { Fragment, useState, useEffect, useRef } from 'react';
import FilterPane from 'shared/filter-pane';
import SearchField from 'shared/search-field';
import Post from 'shared/post';
import FitlerOptions from 'shared/filter-options';
import { getReviewsBook, getReviewsBookByFollowers, getReviewsBookByFriends } from 'reducers/redux-utils/book';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import InfiniteScroll from 'react-infinite-scroll-component';

const ReviewTab = () => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'reviews' },
		{ id: 2, title: 'Bạn bè', value: 'friendReviews' },
		{ id: 3, title: 'Người theo dõi', value: 'followReviews' },
	];

	const [currentOption, setCurrentOption] = useState(filterOptions[0]);
	const [reviewList, setReviewList] = useState([]);
	const [reviewCount, setReviewCount] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();
	const { bookId } = useParams();

	const bookInfo = useSelector(state => state.book.bookInfo);

	useEffect(() => {
		setHasMore(true);
		callApiStart.current = 10;
		getReviewListFirstTime();
	}, [currentOption]);

	const getReviewListFirstTime = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ direction: 'DESC', property: 'createdAt' }]),
				filter: JSON.stringify([
					{ operator: 'eq', value: bookId, property: 'bookId' },
					{ operator: 'eq', value: bookInfo.page, property: 'curProgress' },
				]),
			};

			let response;
			if (currentOption.value === 'reviews') {
				response = await dispatch(getReviewsBook(params)).unwrap();
			} else if (currentOption.value === 'friendReviews') {
				response = await dispatch(getReviewsBookByFriends({ bookId, params })).unwrap();
			} else {
				response = await dispatch(getReviewsBookByFollowers({ bookId, params })).unwrap();
			}
			setReviewList(response.rows);
			setReviewCount(response.count);
			if (!response.rows.length) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getReviewList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ direction: 'DESC', property: 'createdAt' }]),
				filter: JSON.stringify([
					{ operator: 'eq', value: bookId, property: 'bookId' },
					{ operator: 'eq', value: bookInfo.page, property: 'curProgress' },
				]),
			};

			let response;
			if (currentOption.value === 'reviews') {
				response = await dispatch(getReviewsBook(params)).unwrap();
			} else if (currentOption.value === 'friendReviews') {
				response = await dispatch(getReviewsBookByFriends({ bookId, params })).unwrap();
			} else {
				response = await dispatch(getReviewsBookByFollowers({ bookId, params })).unwrap();
			}

			if (response.rows.length > 0) {
				callApiStart.current += callApiPerPage.current;
				setReviewList(reviewList.concat(response.rows));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleChangeOption = item => {
		callApiStart.current = 0;
		setCurrentOption(item);
	};

	return (
		<div className='review-tab'>
			<FilterPane title='Bài review' subtitle={`(${reviewCount} đánh giá)`} key='Bài-review'>
				<FitlerOptions
					list={filterOptions}
					currentOption={currentOption}
					handleChangeOption={handleChangeOption}
					name='filter-user'
					className='review-tab__filter__options'
				/>
				<div className='review-tab__search'>
					<SearchField placeholder='Tìm kiếm theo Hastag, tên người review ...' />
				</div>
				{reviewList.length ? (
					<InfiniteScroll
						dataLength={reviewList.length}
						next={getReviewList}
						hasMore={hasMore}
						loader={<h4>Loading...</h4>}
						className='review-tab__list'
					>
						{reviewList.map(item => (
							<Fragment key={`post-${item.id}`}>
								<Post className='post-container--review' postInformations={item} />
								<hr />
							</Fragment>
						))}
					</InfiniteScroll>
				) : (
					<h5>Chưa có bài Review nào</h5>
				)}
			</FilterPane>
		</div>
	);
};

export default ReviewTab;
