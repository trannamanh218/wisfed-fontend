import { Fragment, useState, useEffect, useRef } from 'react';
import FilterPane from 'shared/filter-pane';
import SearchField from 'shared/search-field';
import Post from 'shared/post';
import FitlerOptions from 'shared/filter-options';
import { getReviewsBook } from 'reducers/redux-utils/book';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import InfiniteScroll from 'react-infinite-scroll-component';

const ReviewTab = () => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'reviews' },
		{ id: 2, title: 'Bạn bè', value: 'friendReviews' },
		{ id: 3, title: 'Người theo dõi', value: 'followReviews' },
	];

	const [defaultOption, setDefaultOption] = useState({ id: 1, title: 'Tất cả', value: 'reviews' });
	const [reviewList, setReviewList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();
	const { bookId } = useParams();

	useEffect(() => {
		getReviewList();
	}, []);

	const getReviewList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ direction: 'DESC', property: 'createdAt' }]),
				filter: JSON.stringify([{ operator: 'eq', value: bookId, property: 'bookId' }]),
			};

			const response = await dispatch(getReviewsBook(params)).unwrap();
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

	const handleChangeOption = data => {
		if (data.value !== defaultOption.value) {
			setDefaultOption(data);
		}
	};

	return (
		<div className='review-tab'>
			{reviewList.length ? (
				<FilterPane title='Bài review' subtitle='(4000 đánh giá)' key='Bài-review'>
					<FitlerOptions
						list={filterOptions}
						defaultOption={defaultOption}
						handleChangeOption={handleChangeOption}
						name='filter-user'
						className='review-tab__filter__options'
					/>
					<div className='review-tab__search'>
						<SearchField placeholder='Tìm kiếm theo Hastag, tên người review ...' />
					</div>
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
				</FilterPane>
			) : (
				<h5>Chưa có bài Review nào</h5>
			)}
		</div>
	);
};

export default ReviewTab;
