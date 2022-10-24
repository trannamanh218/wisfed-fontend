import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import FilterPane from 'shared/filter-pane';
import SearchField from 'shared/search-field';
import Post from 'shared/post';
import FitlerOptions from 'shared/filter-options';
import { getReviewsBook, getReviewsBookByFollowers, getReviewsBookByFriends } from 'reducers/redux-utils/book';
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
import CreatePostModalContent from 'pages/home/components/newfeed/components/creat-post-modal-content';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';

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
	const [checkedStarArr, setCheckedStarArr] = useState([]);
	const [inputSearch, setInputSearch] = useState('');
	const [topUser, setTopUser] = useState('');
	const [showModalCreatPost, setShowModalCreatPost] = useState(false);
	const [option, setOption] = useState({});
	const [bookInfoProp, setBookInfoProp] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [inputSearchUpdated, setInputSearchUpdated] = useState(true);
	const [sort, setSort] = useState([{ direction: 'DESC', property: 'like' }]);
	const [sortValue, setSortValue] = useState(radioOptions[0].value);

	const initialCallApiStartValue = useRef(10);
	const callApiStart = useRef(initialCallApiStartValue.current);
	const callApiPerPage = useRef(10);
	const creatPostModalContainer = useRef(null);

	const dispatch = useDispatch();
	const { bookId } = useParams();

	const bookInfo = useSelector(state => state.book.bookInfo);

	useEffect(() => {
		const cloneObj = { ...bookInfo, progress: null, status: null };
		setBookInfoProp(cloneObj);
	}, []);

	useEffect(() => {
		if (currentTab === 'reviews') {
			setHasMore(true);
			callApiStart.current = initialCallApiStartValue.current;
			getReviewListFirstTime();
		}
	}, [currentOption, currentTab, sort, topUser, inputSearchUpdated]);

	const getReviewListFirstTime = async () => {
		setIsLoading(true);
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
				search: inputSearch.toLocaleLowerCase().trim(),
				sort: JSON.stringify(sort),
				filter: JSON.stringify(
					checkedStarArr.length ? [{ operator: 'in', value: checkedStarArr, property: 'rate' }] : []
				),
				topUser: topUser,
			};

			let response;
			if (currentOption.value === 'allReviews') {
				response = await dispatch(getReviewsBook({ bookId, params })).unwrap();
				if (response.count) {
					dispatch(updateCurrentBookReviewsNumber(response.count));
				}
			} else if (currentOption.value === 'friendReviews') {
				response = await dispatch(getReviewsBookByFriends({ bookId, params })).unwrap();
			} else {
				response = await dispatch(getReviewsBookByFollowers({ bookId, params })).unwrap();
			}
			setReviewList(response.rows);
			setReviewCount(response.count);
			if (!response.count || response.count < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const getReviewList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				search: inputSearch.toLocaleLowerCase().trim(),
				sort: JSON.stringify(sort),
				filter: JSON.stringify([]),
				topUser: topUser,
			};

			let response;
			if (currentOption.value === 'allReviews') {
				response = await dispatch(getReviewsBook({ bookId, params })).unwrap();
			} else if (currentOption.value === 'friendReviews') {
				response = await dispatch(getReviewsBookByFriends({ bookId, params })).unwrap();
			} else {
				response = await dispatch(getReviewsBookByFollowers({ bookId, params })).unwrap();
			}

			if (response.rows.length > 0) {
				callApiStart.current += callApiPerPage.current;
				setReviewList(reviewList.concat(response.rows));
			}
			if (!response.rows.length || response.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	// xử lý cập nhật giá trị tìm kiếm
	const debounceSearch = useCallback(
		_.debounce(() => {
			setInputSearchUpdated(prev => !prev);
		}, 700),
		[]
	);

	const ChangeSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch();
	};
	//--------------------------------------------

	const handleChangeOption = item => {
		setCurrentOption(item);
	};

	// thêm các tùy chọn vào modal tạo review
	const onChangeOption = data => {
		setOption(data);
	};

	// xử lý khi tích chọn lọc theo số sao
	const handleChangeStar = data => {
		const arrTemp = [...checkedStarArr];
		if (arrTemp.includes(data)) {
			const index = arrTemp.indexOf(data);
			arrTemp.splice(index, 1);
		} else {
			arrTemp.push(data);
		}
		setCheckedStarArr(arrTemp);
	};

	// nút xác nhận của modal sắp xếp và lọc reviews
	const onBtnConfirmClick = () => {
		switch (sortValue) {
			case 'mostLiked':
				setSort([{ direction: 'DESC', property: 'like' }]);
				setTopUser('');
				break;
			case 'lastest':
				setSort([{ direction: 'DESC', property: 'createdAt' }]);
				setTopUser('');
				break;
			case 'oldest':
				setSort([{ direction: 'ASC', property: 'createdAt' }]);
				setTopUser('');
				break;
			case 'follow':
				setSort([{ direction: 'DESC', property: 'like' }]);
				setTopUser('follow');
				break;
			case 'review':
				setSort([{ direction: 'DESC', property: 'like' }]);
				setTopUser('review');
				break;
			default:
				break;
		}
		toggleModal();
	};

	// xử lý khi chọn radio
	const handleChange = data => {
		setSortValue(data);
	};

	// xử lý tắt modal tạo review
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
		setShowModalCreatPost(false);
	};

	const handleReview = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			setShowModalCreatPost(true);
		}
	};
	//-----------------------------------------------------------

	return (
		<div className='review-tab'>
			<div className='search-review' onClick={() => handleReview()}>
				<img className='search-review__icon' src={searchreview} />
				<div className='search-review__input'>Bạn review cuốn sách này thế nào</div>
			</div>
			<FilterPane
				title='Bài review'
				subtitle={`(${reviewCount} Reviews)`}
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
				{isLoading ? (
					<div style={{ margin: '28px 0 300px' }}>
						<LoadingIndicator />
					</div>
				) : (
					<>
						{reviewList?.length ? (
							<InfiniteScroll
								dataLength={reviewList?.length}
								next={getReviewList}
								hasMore={hasMore}
								loader={<LoadingIndicator />}
								className='review-tab__list'
							>
								{reviewList.map(item => (
									<Fragment key={`post-${item.id}`}>
										<Post
											className='post-container--review'
											postInformations={item}
											type={REVIEW_TYPE}
										/>
										<hr />
									</Fragment>
								))}
							</InfiniteScroll>
						) : (
							<h5 className='review-tab__no-data'>Chưa có bài Review nào</h5>
						)}
					</>
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
							<Button className='btn' varient='primary' onClick={onBtnConfirmClick}>
								Xác nhận
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
			{showModalCreatPost && (
				<div className='newfeed__creat-post__modal' ref={creatPostModalContainer}>
					<CreatePostModalContent
						hideCreatePostModal={hideCreatePostModal}
						showModalCreatPost={showModalCreatPost}
						option={option}
						onChangeOption={onChangeOption}
						onChangeNewPost={getReviewListFirstTime}
						setShowModalCreatPost={setShowModalCreatPost}
						showSubModal={false}
						bookForCreatePost={bookInfoProp}
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
