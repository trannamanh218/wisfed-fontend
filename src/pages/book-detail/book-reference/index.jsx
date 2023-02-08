import PropTypes from 'prop-types';
import { STATUS_SUCCESS } from 'constants/index';
import { STATUS_LOADING } from 'constants/index';
import { STATUS_IDLE } from 'constants/index';
import RouteLink from 'helpers/RouteLink';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBookDetail } from 'reducers/redux-utils/book';
const BookSlider = lazy(() => import('shared/book-slider'));
import Circle from 'shared/loading/circle';
import './book-reference.scss';
import { NotificationError } from 'helpers/Error';
import { getCategoryList, getListBookByCategory } from 'reducers/redux-utils/category';
import caretIcon from 'assets/images/caret.png';
import { Link } from 'react-router-dom';
import { useFetchAuthorBooks } from 'api/book.hooks';
const ModalSeries = lazy(() => import('shared/modal-series/ModalSeries'));
import { getListBookBySeries } from 'reducers/redux-utils/series';
// import bookImage from 'assets/images/default-book.png';
// import pencil from 'assets/images/pencil.png';

const BookReference = ({ bookInfo, handleGetBookDetail }) => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [allCategories, setAllCategories] = useState([]);
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(3);
	const [relatedBooks, setRelateBooks] = useState([]);
	const [series, setSeries] = useState({});
	const [temporarySeries, setTemporarySeries] = useState({});
	const [listBookOfSeries, setlistBookOfSeries] = useState([]);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userInfo } = useSelector(state => state.auth);

	const { booksAuthor } = useFetchAuthorBooks(bookInfo.authors[0]?.authorId);

	const [showModalSeries, setShowModalSeries] = useState(false);
	const handleCloseModalSeries = () => setShowModalSeries(false);
	const handleShowModalSeries = () => setShowModalSeries(true);

	useEffect(() => {
		if (bookInfo.categories.length) {
			getBooksByCategory();
		}
		getAllCategories();
		if (bookInfo.series) {
			getListBookSeries();
			setSeries(bookInfo.series);
		}
	}, [bookInfo]);

	const getAllCategories = async () => {
		try {
			const res = await dispatch(getCategoryList({ option: false })).unwrap();
			setAllCategories(res.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleViewBookDetail = async data => {
		setStatus(STATUS_LOADING);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setStatus(STATUS_SUCCESS);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
			const statusCode = err?.statusCode || 500;
			setStatus(statusCode);
		}
	};

	const handleViewMore = () => {
		const length = allCategories.length;
		const maxRows = 10;
		if (length <= maxRows) {
			const numberRows = length;
			setRows(numberRows);
		} else {
			setRows(maxRows);
		}
		setIsExpand(true);
	};

	const getBooksByCategory = async () => {
		try {
			const params = {
				start: 0,
				limit: 10,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
			const res = await dispatch(
				getListBookByCategory({ categoryId: bookInfo.categories[0]?.categoryId, params: params })
			).unwrap();
			setRelateBooks(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getListBookSeries = async () => {
		try {
			const res = await dispatch(getListBookBySeries(bookInfo.seriesId)).unwrap();
			setlistBookOfSeries(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	const directNewUrl = () => {
		window.open('https://www.facebook.com/groups/nghiendocvaviet');
	};

	const handleNavigateToBookDetail = (e, item) => {
		e.preventDefault();
		navigate(RouteLink.bookDetail(item.id, item.name));
	};

	return (
		<div className='book-reference'>
			<Suspense fallback={<div>Loading...</div>}>
				<Circle loading={status === STATUS_LOADING} />
				{/* sách của tác giả */}
				{!!bookInfo.authors.length && (
					<BookSlider
						className='book-reference__slider'
						title={`Sách của ${bookInfo.authors[0]?.authorName} `}
						list={booksAuthor}
						handleViewBookDetail={handleViewBookDetail}
					/>
				)}

				{/* Phần hiển thị series */}
				{/* {bookInfo.series ? (
					<>
						{listBookOfSeries.length < 3 ? (
							<>
								<h2 className='book-slider__title'>
									{`Series ${bookInfo.series.name}`}
									{userInfo.role === 'tecinus' || userInfo.role === 'author' ? (
										<img
											className='edit-name__pencil'
											src={pencil}
											alt='pencil'
											title='Chỉnh sửa'
											onClick={handleShowModalSeries}
										/>
									) : (
										''
									)}
								</h2>
								<div
									className='book-reference__slider'
									style={{ display: 'flex', flexDirection: 'row' }}
								>
									{listBookOfSeries.map((item, index) => (
										<div style={{ width: '50%' }} key={index}>
											<Link onClick={e => handleNavigateToBookDetail(e, item)} to='/'>
												<div className='wants-to-read__thumbnail'>
													<img
														src={item.frontBookCover || item.images[0] || bookImage}
														alt='image'
													/>
												</div>
											</Link>
										</div>
									))}
								</div>
							</>
						) : (
							<BookSlider
								className='book-reference__slider'
								title={`Series ${bookInfo.series.name}`}
								list={listBookOfSeries}
								handleViewBookDetail={handleViewBookDetail}
								handleShowModalSeries={handleShowModalSeries}
								editSeriesRole={userInfo.role === 'tecinus' || userInfo.role === 'author'}
							/>
						)}
					</>
				) : (
					''
				)} */}

				{/* Modal thêm series */}
				<ModalSeries
					showModalSeries={showModalSeries}
					handleCloseModalSeries={handleCloseModalSeries}
					series={series}
					setSeries={setSeries}
					temporarySeries={temporarySeries}
					setTemporarySeries={setTemporarySeries}
					bookId={bookInfo.id}
					currentSeries={bookInfo.series}
					handleGetBookDetail={handleGetBookDetail}
				/>

				{relatedBooks.length > 0 && (
					<BookSlider
						className='book-reference__slider'
						title='Gợi ý cùng thể loại'
						list={relatedBooks}
						handleViewBookDetail={handleViewBookDetail}
					/>
				)}
			</Suspense>

			{/* {(userInfo.role === 'tecinus' || userInfo.role === 'author') && !bookInfo.series && (
				<div className='book-reference__add-to-series'>
					<span>Series</span>
					<button className='sidebar__view-more-btn--blue' onClick={handleShowModalSeries}>
						Thêm sê-ri
					</button>
				</div>
			)} */}

			<div className='book-reference__highlight__post'>
				<h4>Bài viết nổi bật</h4>
				<div className='card card-link'>
					<ul className='card-link__list'>
						<a
							className='card-link__item'
							href='https://www.facebook.com/groups/nghiendocvaviet/posts/6486879541340493/'
							target='_blank'
							rel='noreferrer'
							title='REVIEW CHÚC MỘT NGÀY TỐT LÀNH - CUỐN SÁCH ĐÁNG YÊU, ĐÁNG NGẪM'
						>
							REVIEW CHÚC MỘT NGÀY TỐT LÀNH - CUỐN SÁCH ĐÁNG YÊU, ĐÁNG NGẪM
						</a>
						<a
							className='card-link__item'
							href='https://www.facebook.com/groups/nghiendocvaviet/posts/6473526966009084/'
							target='_blank'
							rel='noreferrer'
							title='BỐN ĐIỂM QUAN TRỌNG KHI NÓI TRƯỚC ĐÁM ĐÔNG'
						>
							BỐN ĐIỂM QUAN TRỌNG KHI NÓI TRƯỚC ĐÁM ĐÔNG
						</a>
						<a
							className='card-link__item'
							href='https://www.facebook.com/groups/nghiendocvaviet/posts/6477151115646669/'
							target='_blank'
							rel='noreferrer'
							title='VƯỢT QUA SỰ TRÌ HOÃN, DỄ HAY KHÓ?'
						>
							VƯỢT QUA SỰ TRÌ HOÃN, DỄ HAY KHÓ?
						</a>
						<a
							className='card-link__item'
							href='https://www.facebook.com/groups/nghiendocvaviet/posts/6469520223076425/'
							target='_blank'
							rel='noreferrer'
							title='MỘT TÁCH TRÀ THIỀN – TĨNH TẠI TRƯỚC NHỮNG THAY ĐỔI QUANH MÌNH'
						>
							MỘT TÁCH TRÀ THIỀN – TĨNH TẠI TRƯỚC NHỮNG THAY ĐỔI QUANH MÌNH
						</a>
					</ul>
				</div>
				<button className='sidebar__view-more-btn--blue' onClick={directNewUrl}>
					Xem thêm
				</button>
			</div>

			{allCategories.length > 0 && (
				<>
					<h2 className='statistic-title'>Chủ đề</h2>
					<div className='dualColumn'>
						<ul className='dualColumn-list'>
							{allCategories.length > 0 &&
								allCategories.slice(0, rows).map((item, index) => (
									<li
										className='dualColumn-item'
										key={index}
										style={{ cursor: 'pointer' }}
										onClick={() => navigate(RouteLink.categoryDetail(item.id, item.name))}
									>
										<span className='dualColumn-item__title'>{item.name}</span>
										<span className='dualColumn-item__number'>{item.numberBooks} cuốn</span>
									</li>
								))}
						</ul>
						{!isExpand && allCategories.length > 0 && (
							<button className='dualColumn-btn' onClick={handleViewMore}>
								<img className='view-caret' src={caretIcon} alt='caret-icon' />
								<span>Xem thêm</span>
							</button>
						)}
						{isExpand && (
							<Link to={`/category`} className='sidebar__view-more-btn--blue'>
								Xem thêm
							</Link>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default BookReference;

BookReference.propTypes = {
	bookInfo: PropTypes.object,
	handleGetBookDetail: PropTypes.func,
};
