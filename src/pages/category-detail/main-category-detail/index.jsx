import caretIcon from 'assets/images/caret.png';
import classNames from 'classnames';
import { Heart } from 'components/svg';
import { POST_TYPE } from 'constants/index';
import { NotificationError } from 'helpers/Error';
import RouteLink from 'helpers/RouteLink';
import Storage from 'helpers/Storage';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { getBookDetail } from 'reducers/redux-utils/book';
import {
	getCategoryDetail,
	getFavoriteCategories,
	getListBookByCategory,
	getPostsByCategory,
	updateCategoryInfoIsLike,
} from 'reducers/redux-utils/category';
import { editUserInfo } from 'reducers/redux-utils/user';
import BackButton from 'shared/back-button';
import BookThumbnail from 'shared/book-thumbnail';
import Button from 'shared/button';
import CategoryGroup from 'shared/category-group';
import FilterPane from 'shared/filter-pane';
import FormCheckGroup from 'shared/form-check-group';
import LoadingIndicator from 'shared/loading-indicator';
import Circle from 'shared/loading/circle';
import SearchField from 'shared/search-field';
import './main-category-detail.scss';
import SearchBook from './SearchBook';
const Post = lazy(() => import('shared/post'));

const MainCategoryDetail = ({ setErrorLoadPage }) => {
	const { id } = useParams();
	const { userInfo } = useSelector(state => state.auth);
	const categoryInfoRedux = useSelector(state => state.category.categoryInfo);

	const [categoryInfo, setCategoryInfo] = useState({});
	const [bookList, setBookList] = useState([]);
	const [isLike, setIsLike] = useState(false);
	const [inputSearch, setInputSearch] = useState('');
	const [filter, setFilter] = useState('[]');
	const [hasMore, setHasMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [isFetchingBookList, setIsFetchingBookList] = useState(true);
	const [isFetchingBookDetail, setIsFetchingBookDetail] = useState(false);
	const [postsByCategory, setPostsByCategory] = useState([]);
	const [hasMorePost, setHasMorePost] = useState(true);
	const [sortValue, setSortValue] = useState('like');
	const [sortDirection, setSortDirection] = useState('DESC');
	const [sortValueTemp, setSortValueTemp] = useState('default');
	const [fetchingIsLike, setFetchingIsLike] = useState(false);
	const [slidesToShow, setSlidesToShow] = useState(4);

	const callApiStart = useRef(8);
	const callApiPerPage = useRef(8);
	const callApiStartGetPosts = useRef(10);
	const callApiPerPageGetPosts = useRef(10);
	const favoriteCategories = useRef([]);
	const isLikeTemp = useRef(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const radioOptions = [
		{
			value: 'default',
			title: 'Bài viết nhiều like nhất',
		},
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
		if (!_.isEmpty(categoryInfoRedux) && categoryInfoRedux.id === Number(id)) {
			setCategoryInfo(categoryInfoRedux);
		} else {
			getCategoryInfoFnc();
		}
		setFilter('[]');
		checkFavoriteCategoriesData();
	}, [id]);

	useEffect(() => {
		if (!_.isEmpty(categoryInfo)) {
			setIsLike(categoryInfo.isFavorite);
			isLikeTemp.current = categoryInfo.isFavorite;
		}
	}, [categoryInfo]);

	useEffect(() => {
		setHasMore(true);
		callApiStart.current = 8;
		getBooksByCategoryFirstTime();
	}, [filter, id]);

	useEffect(() => {
		setHasMorePost(true);
		callApiStartGetPosts.current = 10;
		handleGetPostsByCategoryFirstTime();
	}, [userInfo, id, sortDirection, sortValue]);

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	const handleResize = () => {
		const container = document.querySelector('.main-category-detail__allbook');
		const containerWidth = container?.offsetWidth,
			itemWidth = 200;
		const result = Math.floor(containerWidth / itemWidth);
		if (!isNaN(result) && result > 0) {
			setSlidesToShow(result);
		}
	};

	const getCategoryInfoFnc = async () => {
		try {
			const res = await dispatch(getCategoryDetail(id)).unwrap();
			setCategoryInfo(res);
		} catch (err) {
			NotificationError(err);
			setErrorLoadPage(true);
		}
	};

	const checkFavoriteCategoriesData = async () => {
		try {
			const res = await dispatch(getFavoriteCategories()).unwrap();
			favoriteCategories.current = res.rows;
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleLikeCategory = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			setFetchingIsLike(true);
			handleCallLikeAndUnlikeCategoryApi(!isLike);
		}
	};

	const handleCallLikeAndUnlikeCategoryApi = useCallback(
		_.debounce(async isLikeData => {
			const categoryId = parseInt(id);
			if (isLikeData !== isLikeTemp.current) {
				isLikeTemp.current = isLikeData;
				let favoriteCategoryList = [];
				if (!isLikeData) {
					favoriteCategories.current.forEach(item => {
						if (item.categoryId !== categoryId) {
							favoriteCategoryList.push(item.categoryId);
						}
					});
				} else {
					favoriteCategoryList = favoriteCategories.current.map(item => item.categoryId);
					favoriteCategoryList.push(categoryId);
				}
				try {
					const params = {
						favoriteCategory: favoriteCategoryList,
					};
					await dispatch(editUserInfo(params)).unwrap();
					setIsLike(prev => !prev);
					dispatch(updateCategoryInfoIsLike(!isLike));
				} catch (err) {
					NotificationError(err);
				} finally {
					setFetchingIsLike(false);
				}
			}
		}, 1000),
		[favoriteCategories.current, userInfo]
	);

	const getBooksByCategoryFirstTime = async () => {
		setIsFetchingBookList(true);
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: filter,
			};
			const res = await dispatch(getListBookByCategory({ categoryId: id, params: params })).unwrap();
			setBookList(res);
			if (!res.length || res.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetchingBookList(false);
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

	const updateInputSearch = value => {
		if (value) {
			const filterValue = [{ 'operator': 'search', 'value': value.trim(), 'property': 'name' }];
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

	const handleGetPostsByCategoryFirstTime = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPageGetPosts.current,
				sort: JSON.stringify([{ direction: sortDirection, property: sortValue }]),
			};
			const res = await dispatch(getPostsByCategory({ categoryId: id, params })).unwrap();
			setPostsByCategory(res);
			if (!res.length || res.length < callApiPerPageGetPosts.current) {
				setHasMorePost(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleGetPostsByCategory = async () => {
		try {
			const params = {
				start: callApiStartGetPosts.current,
				limit: callApiPerPageGetPosts.current,
				sort: JSON.stringify([{ direction: sortDirection, property: sortValue }]),
			};
			const res = await dispatch(getPostsByCategory({ categoryId: id, params })).unwrap();
			if (res.length) {
				if (res.length < callApiPerPageGetPosts.current) {
					setHasMorePost(false);
				} else {
					callApiStartGetPosts.current += callApiPerPageGetPosts.current;
				}
				setPostsByCategory(postsByCategory.concat(res));
			} else {
				setHasMorePost(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleChange = data => {
		setSortValueTemp(data);
	};

	const handleSortQuotes = () => {
		if (sortValueTemp === 'default') {
			setSortValue('like');
			setSortDirection('DESC');
		} else if (sortValueTemp === 'newest') {
			setSortValue('createdAt');
			setSortDirection('DESC');
		} else if (sortValueTemp === 'oldest') {
			setSortValue('createdAt');
			setSortDirection('ASC');
		}
		setShowModal(false);
	};

	const handleViewTopBooksOfWeek = () => {
		localStorage.setItem('category', JSON.stringify({ value: categoryInfo.id, title: categoryInfo.name }));
		navigate('/top100');
	};

	return (
		<div className='main-category-detail'>
			<Circle loading={isFetchingBookDetail} />
			<>
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
							<div className='main-category-detail__header__name'>{categoryInfo.name}</div>
							{isLike !== null && (
								<Button
									className={classNames('btn-like', { 'active': isLike })}
									isOutline={true}
									onClick={handleLikeCategory}
									disabled={fetchingIsLike}
								>
									<span className='heart-icon'>
										<Heart />
									</span>
									<span>{isLike ? 'Đã yêu thích' : 'Yêu thích'}</span>
								</Button>
							)}
						</div>

						{categoryInfo.description && (
							<p
								className='main-category-detail__intro'
								dangerouslySetInnerHTML={{ __html: categoryInfo.description }}
							></p>
						)}

						<div className='main-category-detail__container'>
							<SearchField
								placeholder={`Tìm kiếm sách trong chủ đề ${categoryInfo.name}`}
								handleChange={handleSearch}
								value={inputSearch}
							/>

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
												handleViewCategoryDetail={handleViewTopBooksOfWeek}
												inCategoryDetail
											/>
										)}

										<div className='main-category-detail__allbook'>
											{bookList.length > 0 ? (
												<>
													<h3>
														{`Tất cả sách chủ đề "	${
															categoryInfo.name ? categoryInfo.name.toLowerCase() : ''
														} " (${categoryInfo.numberBooks})`}
													</h3>
													<div
														className='books'
														style={{
															display: `grid`,
															gridTemplateColumns: `repeat(${slidesToShow}, 1fr)`,
															gridRowGap: '16px',
														}}
													>
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
												</>
											) : (
												<p
													style={{
														textAlign: 'center',
														fontSize: '18px',
													}}
												>
													Chưa có cuốn sách nào thuộc chủ đề này
												</p>
											)}
										</div>
									</>
								)}
								{isFetchingBookList && <LoadingIndicator />}
								{hasMore && (
									<button className='get-more-books-btn' onClick={handleViewMore}>
										<img src={caretIcon} alt='caret-icon' />
										<span>Xem thêm</span>
									</button>
								)}
							</>
						</div>

						{!!postsByCategory.length && (
							<FilterPane
								title='Bài viết hay nhất'
								handleSortFilter={handleSortPost}
								hasHeaderLine={true}
							>
								<div className='main-category-detail__posts'>
									<InfiniteScroll
										dataLength={postsByCategory.length}
										next={handleGetPostsByCategory}
										hasMore={hasMorePost}
										loader={<LoadingIndicator />}
									>
										{postsByCategory.map(item => (
											<Suspense key={item.id} fallback={<></>}>
												<Post
													className='post__container--category'
													postInformations={item}
													type={POST_TYPE}
												/>
											</Suspense>
										))}
									</InfiniteScroll>
								</div>
								<Modal
									show={showModal}
									onHide={() => setShowModal(false)}
									className='main-category-detail__modal'
									keyboard={false}
									centered
								>
									<ModalBody className='main-category-detail__modal__content'>
										<div className='main-category-detail__modal__group'>
											<h6 className='main-category-detail__modal__title'>Mặc định</h6>
											<FormCheckGroup
												data={radioOptions[0]}
												name='custom'
												type='radio'
												defaultValue='default'
												handleChange={handleChange}
												checked={radioOptions[0].value === sortValueTemp}
											/>
											<h6
												style={{ marginTop: '24px' }}
												className='main-category-detail__modal__title'
											>
												Theo thời gian tạo
											</h6>
											<FormCheckGroup
												data={radioOptions[1]}
												name='custom'
												type='radio'
												defaultValue='default'
												handleChange={handleChange}
												checked={radioOptions[1].value === sortValueTemp}
											/>
											<FormCheckGroup
												data={radioOptions[2]}
												name='custom'
												type='radio'
												defaultValue='default'
												handleChange={handleChange}
												checked={radioOptions[2].value === sortValueTemp}
											/>
										</div>
										<Button className='main-category-detail__modal__btn' onClick={handleSortQuotes}>
											Xác nhận
										</Button>
									</ModalBody>
								</Modal>
							</FilterPane>
						)}
					</>
				)}
			</>
		</div>
	);
};

MainCategoryDetail.propTypes = {
	handleViewBookDetail: PropTypes.func,
	setErrorLoadPage: PropTypes.func,
};

export default MainCategoryDetail;
