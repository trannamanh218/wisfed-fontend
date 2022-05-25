import { Fragment, useCallback, useEffect, useState, useRef } from 'react';
import { useFetchCategoryDetail } from 'api/category.hook';
import classNames from 'classnames';
import { Heart } from 'components/svg';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'shared/back-button';
import BookThumbnail from 'shared/book-thumbnail';
import Button from 'shared/button';
import CategoryGroup from 'shared/category-group';
import FilterPane from 'shared/filter-pane';
import Post from 'shared/post';
import SearchField from 'shared/search-field';
import './main-category-detail.scss';
import SearchBook from './SearchBook';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'react-bootstrap';
import MultipleRadio from 'shared/multiple-radio';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToFavoriteCategory } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { getListBookByCategory } from 'reducers/redux-utils/category';
import caretIcon from 'assets/images/caret.png';
import { getBookDetail } from 'reducers/redux-utils/book';
import RouteLink from 'helpers/RouteLink';
import Circle from 'shared/loading/circle';
import LoadingIndicator from 'shared/loading-indicator';
import { STATUS_LOADING } from 'constants';

const MainCategoryDetail = () => {
	const { id } = useParams();
	const { categoryInfo, status } = useFetchCategoryDetail(id);
	const books = categoryInfo?.books || [];

	const [bookList, setBookList] = useState(books.slice(0, 10));
	const [isLike, setIsLike] = useState(false);
	const [inputSearch, setInputSearch] = useState('');
	const [filter, setFilter] = useState('[]');
	const [hasMore, setHasMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [isFetchingBookList, setIsFetchingBookList] = useState(true);
	const [isFetchingBookDetail, setIsFetchingBookDetail] = useState(false);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(16);

	const navigate = useNavigate();
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	const checkOptions = [
		{
			value: 'likeMost',
			title: 'Review nhiều like nhất',
		},
	];

	const publishOptiosn = [
		{
			value: 'newest',
			title: 'Mới nhất',
		},
		{
			value: 'oldest',
			title: 'Cũ nhất',
		},
	];

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			const { favoriteCategory } = userInfo;
			const index = favoriteCategory.findIndex(item => item.categoryId === parseInt(id));
			if (index !== -1) {
				setIsLike(true);
			} else {
				setIsLike(false);
			}
		}
	}, [userInfo, id]);

	useEffect(() => {
		getBooksByCategory();
	}, [filter]);

	const handleLikeCategory = async () => {
		const categoryId = parseInt(id);
		if (_.isEmpty(userInfo)) {
			toast.warn('Vui lòng đăng nhập để sử dụng tính năng này');
		} else {
			let favoriteCategory = [];
			if (isLike) {
				favoriteCategory = userInfo.favoriteCategory.forEach(item => {
					if (item.categoryId !== categoryId) {
						favoriteCategory.push(item.categoryId);
					}
				});
			} else {
				favoriteCategory = userInfo.favoriteCategory.map(item => item.categoryId);
				favoriteCategory.push(categoryId);
			}

			try {
				const params = {
					id: userInfo.id,
					favoriteCategory,
				};
				await dispatch(addToFavoriteCategory(params));
				setIsLike(like => !like);
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	const getBooksByCategory = async () => {
		setIsFetchingBookList(true);
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: filter,
			};
			const res = await dispatch(getListBookByCategory({ categoryId: id, params: params })).unwrap();
			if (res.length) {
				if (res.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setBookList(bookList.concat(res));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetchingBookList(false);
		}
	};

	const handleViewMore = () => {
		getBooksByCategory();
	};

	const postList = Array.from(Array(5)).fill({
		id: 1,
		userAvatar: '/images/avatar.png',
		userName: 'Trần Văn Đức',
		bookImage: '',
		bookName: '',
		isLike: true,
		likeNumber: 15,
		commentNumber: 1,
		shareNumber: 3,
	});

	const updateInputSearch = value => {
		if (value) {
			const filterValue = [{ 'operator': 'search', 'value': value.trim(), 'property': 'name' }];
			callApiStart.current = 0;
			setBookList([]);
			setFilter(JSON.stringify(filterValue));
			setHasMore(true);
		} else {
			setFilter('[]');
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 1000), []);

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const handleSortPost = () => {
		setShowModal(true);
	};

	const handleViewBookDetail = async data => {
		setIsFetchingBookDetail(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setIsFetchingBookDetail(false);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='main-category-detail'>
			<Circle loading={isFetchingBookDetail || status === STATUS_LOADING} />
			{_.isEmpty(categoryInfo) ? (
				<>
					<div className='main-category-detail__header'>
						<BackButton destination='/category' />
					</div>
					<p className='main-category-detail__intro'>Không tìm thấy chủ đề</p>
				</>
			) : (
				<>
					<div className='main-category-detail__header'>
						<BackButton destination='/category' />
						<h4>{categoryInfo.name}</h4>
						<Button
							className={classNames('btn-like', { 'active': isLike })}
							isOutline={true}
							onClick={handleLikeCategory}
						>
							<span className='heart-icon'>
								<Heart />
							</span>
							<span>{isLike ? 'Đã yêu thích' : 'Yêu thích'}</span>
						</Button>
					</div>

					{categoryInfo.description && (
						<p className='main-category-detail__intro'>{categoryInfo.description}</p>
					)}

					<div className='main-category-detail__container'>
						<SearchField
							placeholder={`Tìm kiếm sách trong chủ đề ${categoryInfo.name}`}
							handleChange={handleSearch}
							value={inputSearch}
						/>

						<>
							{isFetchingBookList ? (
								<LoadingIndicator />
							) : (
								<>
									{filter !== '[]' ? (
										<SearchBook
											list={bookList}
											handleViewBookDetail={handleViewBookDetail}
											inputSearch={inputSearch}
										/>
									) : (
										<>
											{!!categoryInfo?.topBookReads.length && (
												<CategoryGroup
													key={`category-group`}
													list={categoryInfo.topBookReads}
													title='Đọc nhiều nhất tuần này'
													handleViewBookDetail={handleViewBookDetail}
												/>
											)}

											<div className='main-category-detail__allbook'>
												<h4>
													{`Tất cả sách chủ đề "${
														categoryInfo.name ? categoryInfo.name.toLowerCase() : ''
													}"`}
												</h4>
												<div className='books'>
													{bookList.map((item, index) => (
														<BookThumbnail
															key={index}
															{...item}
															source={item.source}
															size='lg'
															data={item}
															handleClick={handleViewBookDetail}
														/>
													))}
												</div>
											</div>
										</>
									)}
									{hasMore && (
										<button className='get-more-books-btn' onClick={handleViewMore}>
											<img src={caretIcon} alt='caret-icon' />
											<span>Xem thêm</span>
										</button>
									)}
								</>
							)}
						</>
					</div>

					<FilterPane title='Bài viết hay nhất' handleSortFilter={handleSortPost} hasHeaderLine={true}>
						<div className='main-category-detail__posts'>
							{postList && postList.length
								? postList.map((item, index) => (
										<Fragment key={`post-${index}`}>
											<Post className='post__container--category' postInformations={item} />
										</Fragment>
								  ))
								: null}
						</div>
						<Modal
							show={showModal}
							onHide={() => setShowModal(false)}
							className='main-category-detail__modal'
							keyboard={false}
							centered
						>
							<ModalBody>
								<div className='main-category-detail__modal__option__group'>
									<h4>Mặc định</h4>
									<MultipleRadio list={checkOptions} name='default' defaultValue='likeMost' />
								</div>
								{/* <div className='main-category-detail__modal__option__group'>
									<h4>Theo số sao</h4>
									<MultipleCheckbox list={starOptions} name='star' value='1' />
								</div> */}
								<div className='main-category-detail__modal__option__group'>
									<h4>Theo thời gian tạo bài viết</h4>
									<MultipleRadio list={publishOptiosn} name='pulish-time' defaultValue='' />
								</div>
								{/* <div className='main-category-detail__modal__option__group'>
									<h4>Theo người review</h4>
									<MultipleCheckbox list={reviewOptions} name='review' value='' />
								</div> */}
								<Button className='btn-confirm'>Xác nhận</Button>
							</ModalBody>
						</Modal>
					</FilterPane>
				</>
			)}
		</div>
	);
};

MainCategoryDetail.propTypes = {
	handleViewBookDetail: PropTypes.func,
};

export default MainCategoryDetail;
