import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import FilterPane from 'shared/filter-pane';
import SearchField from 'shared/search-field';
import Post from 'shared/post';
import FitlerOptions from 'shared/filter-options';
import {
	getReviewsBook,
	getReviewsBookByFollowers,
	getReviewsBookByFriends,
	createReviewBook,
} from 'reducers/redux-utils/book';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import InfiniteScroll from 'react-infinite-scroll-component';
import { updateCurrentBookReviewsNumber } from 'reducers/redux-utils/book';
import _ from 'lodash';
import LoadingIndicator from 'shared/loading-indicator';
import PropTypes from 'prop-types';
import './ReviewTab.scss';
import { Modal } from 'react-bootstrap';
import { useModal } from 'shared/hooks';
import FormCheckGroup from 'shared/form-check-group';
import Button from 'shared/button';
import { REVIEW_TYPE } from 'constants/index';
import searchreview from 'assets/images/search-review.png';
import CreatPostModalContentReviewBookOnly from './CreatPostModalContentReviewBookOnly';

const ReviewTab = ({ currentTab }) => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'allReviews' },
		{ id: 2, title: 'Bạn bè', value: 'friendReviews' },
		{ id: 3, title: 'Người theo dõi', value: 'followReviews' },
	];

	const radioOptions = [
		{ value: 'mostLiked', title: 'Review nhiều like nhất' },
		{ value: 'lastest', title: 'Mới nhất' },
		{ value: 'oldest', title: 'Cũ nhất' },
		{ value: 'follow', title: 'Có nhiều Follow nhất' },
		{ value: 'review', title: 'Có nhiều Review nhất' },
	];
	const checkBoxStarOptions = [
		{
			value: '5',
			title: '5 sao',
		},
		{
			value: '4',
			title: '4 sao',
		},
		{
			value: '3',
			title: '3 sao',
		},
		{
			value: '2',
			title: '2 sao',
		},
		{
			value: '1',
			title: '1 sao',
		},
	];

	const [currentOption, setCurrentOption] = useState(filterOptions[0]);
	const [reviewList, setReviewList] = useState([]);
	const [reviewCount, setReviewCount] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const { modalOpen, toggleModal } = useModal(false);
	const [sortValue, setSortValue] = useState('mostLiked');
	const [checkedStarArr, setCheckedStarArr] = useState([]);
	const [directionSort, setDirectionSort] = useState('DESC');
	const [propertySort, setPropertySort] = useState('like');
	const [inputSearch, setInputSearch] = useState('');
	const [topUser, setTopUser] = useState('');
	const [filterRate, setFilterRate] = useState(false);
	const [reviewBook, setReviewBook] = useState('');
	const [showModalCreatPost, setShowModalCreatPost] = useState(false);
	const [option, setOption] = useState({});
	const [valueSearch, setValueSearch] = useState('');

	const { userInfo } = useSelector(state => state.auth);

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);
	const creatPostModalContainer = useRef(null);

	const dispatch = useDispatch();
	const { bookId } = useParams();

	const bookInfo = useSelector(state => state.book.bookInfo);

	const [bookInfoProp, setBookInfoProp] = useState({});

	useEffect(() => {
		const cloneObj = { ...bookInfo };
		cloneObj.progress = NaN;
		setBookInfoProp(cloneObj);
	}, []);

	useEffect(() => {
		if (currentTab === 'reviews') {
			callApiStart.current = 10;
			getReviewListFirstTime();
		}
	}, [currentOption, currentTab, directionSort, propertySort, valueSearch]);

	const updateInputSearch = value => {
		if (value) {
			const filterValue = value.toLowerCase().trim();
			setValueSearch(JSON.stringify(filterValue));
		} else {
			setValueSearch('');
		}
	};

	const getReviewListFirstTime = async () => {
		try {
			let params;
			if (filterRate) {
				params = {
					start: 0,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ direction: directionSort, property: propertySort }]),
					filter: JSON.stringify([
						{ operator: 'eq', value: bookId, property: 'bookId' },
						{ operator: 'in', value: checkedStarArr, property: 'rate' },
					]),
					searchUser: valueSearch,
				};
			} else {
				params = {
					start: 0,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ direction: directionSort, property: propertySort }]),
					filter: JSON.stringify([{ operator: 'eq', value: bookId, property: 'bookId' }]),
					searchUser: valueSearch,
				};
			}

			let response;
			if (currentOption.value === 'allReviews') {
				response = await dispatch(getReviewsBook(params)).unwrap();
				if (!_.isEmpty(response)) {
					dispatch(updateCurrentBookReviewsNumber(response.count));
				}
			} else if (currentOption.value === 'friendReviews') {
				const data = await dispatch(getReviewsBookByFriends({ bookId, params })).unwrap();
				response = data.rows;
			} else {
				const data = (response = await dispatch(getReviewsBookByFollowers({ bookId, params })).unwrap());
				response = data.rows;
			}
			setReviewList(response);
			setReviewCount(response.length);
			if (!response.rows.length || response.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	console.log(hasMore, reviewList);

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	const ChangeSearch = e => {
		setInputSearch(e.target.value);
		if (currentTab === 'reviews') {
			callApiStart.current = 10;
			debounceSearch(e.target.value);
		}
	};

	const postReviewList = async () => {
		const params = {
			bookId: parseInt(bookId),

			content: reviewBook,
		};

		try {
			return dispatch(createReviewBook(params));
		} catch (err) {
			NotificationError(err);
		}
	};

	const getReviewList = async () => {
		try {
			let params = {};
			if (sortValue === 'oldest' || sortValue === 'lastest' || sortValue === 'mostLiked' || filterRate === true) {
				params = {
					start: callApiStart.current,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ direction: directionSort, property: propertySort }]),
					filter: JSON.stringify([
						{ operator: 'eq', value: bookId, property: 'bookId' },

						{ operator: 'in', value: checkedStarArr, property: 'rate' },
					]),
					searchUser: inputSearch,
				};
			} else {
				params = {
					start: 0,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ direction: directionSort, property: propertySort }]),
					filter: JSON.stringify([{ operator: 'eq', value: bookId, property: 'bookId' }]),
					topUser: topUser,
					searchUser: inputSearch,
				};
			}

			let response;
			if (currentOption.value === 'allReviews') {
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
	const handleKeyPress = async e => {
		if (e.key === 'Enter' && !_.isEmpty(reviewBook)) {
			const rs = await postReviewList();
			setReviewBook('');
			const newPayload = JSON.parse(JSON.stringify(rs.payload));

			newPayload['user'] = userInfo;

			let newPost = [newPayload, ...reviewList];

			setReviewList(newPost);
		}
	};

	const onBtnConfirmClick = () => {
		switch (sortValue) {
			case 'oldest':
				setPropertySort('createdAt');
				setDirectionSort('ASC');
				break;
			case 'lastest':
				setPropertySort('createdAt');
				setDirectionSort('DESC');
				break;
			case 'mostLiked':
				setPropertySort('like');
				setDirectionSort('DESC');
				break;
			case 'follow':
				setTopUser('follow');
				break;
			case 'review':
				setTopUser('review');
				break;
			case 'rate':
				getReviewListFirstTime();
				break;
			default:
		}
	};

	// useEffect(() => {
	// 	getReviewList();
	// }, [topUser]);

	const handleChange = data => {
		setSortValue(data);
	};

	const changeReview = e => {
		setReviewBook(e.target.value);
	};

	const handleChangeStar = data => {
		if (checkedStarArr.length < 1) {
			setCheckedStarArr([...checkedStarArr, data]);
		} else if (!checkedStarArr.includes(data)) {
			setCheckedStarArr([...checkedStarArr, data]);
		} else if (checkedStarArr.includes(data)) {
			const newArr = checkedStarArr.filter(item => item !== data);
			setCheckedStarArr(newArr);
		}
		if (checkedStarArr.length == 0) setFilterRate(false);
		else setFilterRate(true);
	};

	useEffect(() => {
		if (showModalCreatPost) {
			creatPostModalContainer.current.addEventListener('mousedown', e => {
				if (e.target === creatPostModalContainer.current) {
					hideCreatePostModal();
				}
			});
		}
	}, [showModalCreatPost]);

	const hideCreatePostModal = () => {
		// dispatch(resetTaggedDataFunc(true));
		// dispatch(saveDataShare({}));
		// dispatch(updateImg([]));
		// dispatch(updateCurrentBook({}));
		// setOption({});
		setShowModalCreatPost(false);
	};

	const onChangeOption = data => {
		setOption(data);
	};

	return (
		<div className='review-tab'>
			<div className='search-review'>
				<img className='search-review__icon' src={searchreview} />
				<input
					className='search-review__input'
					placeholder='Bạn review cuốn sách này thế nào'
					onClick={() => setShowModalCreatPost(true)}
					onChange={changeReview}
					value={reviewBook}
					onKeyPress={handleKeyPress}
				/>
			</div>
			<FilterPane
				title='Bài review'
				subtitle={`(${reviewCount} đánh giá)`}
				key='Bài-review'
				handleSortFilter={toggleModal}
			>
				<FitlerOptions
					list={filterOptions}
					currentOption={currentOption}
					handleChangeOption={handleChangeOption}
					name='filter-user'
					className='review-tab__filter__options'
				/>
				<div className='review-tab__search'>
					<SearchField
						value={inputSearch}
						handleChange={ChangeSearch}
						placeholder='Tìm kiếm theo Hashtag, tên người review ...'
						autoFocus={false}
					/>
				</div>
				{currentTab === 'reviews' && reviewList?.length ? (
					<InfiniteScroll
						dataLength={reviewList?.length}
						next={getReviewList}
						hasMore={hasMore}
						loader={<LoadingIndicator />}
						className='review-tab__list'
					>
						{reviewList.map(item => (
							<Fragment key={`post-${item.id}`}>
								<Post className='post-container--review' postInformations={item} type={REVIEW_TYPE} />
								<hr />
							</Fragment>
						))}
					</InfiniteScroll>
				) : (
					<h5 className='review-tab__no-data'>Chưa có bài Review nào</h5>
				)}
			</FilterPane>

			<Modal className='sort-review-modal' show={modalOpen} onHide={toggleModal}>
				<Modal.Body>
					<div className='filter-quote-pane__setting__group'>
						<div className='sort-review-modal__item'>
							<span className='filter-quote-pane__setting__title'>Mặc định</span>
						</div>
						<div className='sort-review-modal__item'>
							<FormCheckGroup
								data={radioOptions[0]}
								name='custom-radio'
								type='radio'
								handleChange={handleChange}
								checked={radioOptions[0].value === sortValue}
							/>
						</div>
						<div className='sort-review-modal__item'>
							<span className='filter-quote-pane__setting__title'>Theo số sao</span>
						</div>
						{checkBoxStarOptions.map((element, index) => {
							return (
								<div key={index} className='sort-review-modal__item'>
									<FormCheckGroup
										data={element}
										name='checkbox-star'
										type='checkbox'
										handleChange={handleChangeStar}
										checked={checkedStarArr.includes(element.value)}
									/>
								</div>
							);
						})}
						<div className='sort-review-modal__item'>
							<span className='filter-quote-pane__setting__title'>Theo thời gian phát hành</span>
						</div>
						<div className='sort-review-modal__item'>
							<FormCheckGroup
								data={radioOptions[1]}
								name='custom-radio'
								type='radio'
								handleChange={handleChange}
								checked={radioOptions[1].value === sortValue}
							/>
						</div>
						<div className='sort-review-modal__item'>
							<FormCheckGroup
								data={radioOptions[2]}
								name='custom-radio'
								type='radio'
								handleChange={handleChange}
								checked={radioOptions[2].value === sortValue}
							/>
						</div>
						<div className='sort-review-modal__item'>
							<span className='filter-quote-pane__setting__title'>Theo người Review</span>
						</div>
						<div className='sort-review-modal__item'>
							<FormCheckGroup
								data={radioOptions[3]}
								name='custom-radio'
								type='radio'
								handleChange={handleChange}
								checked={radioOptions[3].value === sortValue}
							/>
						</div>
						<div className='sort-review-modal__item'>
							<FormCheckGroup
								data={radioOptions[4]}
								name='custom-radio'
								type='radio'
								handleChange={handleChange}
								checked={radioOptions[4].value === sortValue}
							/>
						</div>
						<div className='sort-review-modal__item' style={{ marginTop: '10px' }}>
							<Button
								className='btn'
								varient='primary'
								onClick={() => {
									onBtnConfirmClick(), toggleModal();
								}}
							>
								Xác nhận
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
			{showModalCreatPost && (
				<div className='newfeed__creat-post__modal' ref={creatPostModalContainer}>
					<CreatPostModalContentReviewBookOnly
						hideCreatePostModal={hideCreatePostModal}
						showModalCreatPost={showModalCreatPost}
						option={option}
						setOption={setOption}
						onChangeOption={onChangeOption}
						onChangeNewPost={() => {}}
						setShowModalCreatPost={setShowModalCreatPost}
						showSubModal={false}
						bookInfoProp={bookInfoProp}
					/>
				</div>
			)}
		</div>
	);
};

ReviewTab.propTypes = {
	currentTab: PropTypes.string,
};

export default ReviewTab;
