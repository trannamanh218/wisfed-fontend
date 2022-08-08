import { STATUS_SUCCESS } from 'constants';
import { STATUS_LOADING } from 'constants';
import { STATUS_IDLE } from 'constants';
import RouteLink from 'helpers/RouteLink';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBookDetail } from 'reducers/redux-utils/book';
import BookSlider from 'shared/book-slider';
import Circle from 'shared/loading/circle';
import './book-reference.scss';
import { NotificationError } from 'helpers/Error';
import { getCategoryList, getListBookByCategory } from 'reducers/redux-utils/category';
import caretIcon from 'assets/images/caret.png';
import { Link } from 'react-router-dom';
import { useFetchAuthorBooks } from 'api/book.hooks';
// import { Row, Col } from 'react-bootstrap';
// import bookImage from 'assets/images/default-book.png';

const BookReference = () => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [allCategories, setAllCategories] = useState([]);
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(3);
	const [relatedBooks, setRelateBooks] = useState([]);
	// const [series, setSeries] = useState([]);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { bookInfo } = useSelector(state => state.book);

	const { booksAuthor } = useFetchAuthorBooks(bookInfo.authors[0]?.authorId);

	useEffect(() => {
		getBooksByCategory();
		getAllCategories();
		// setSeries();
	}, []);

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

	const directNewUrl = () => {
		window.open('https://www.tecinus.vn');
	};

	return (
		<div className='book-reference'>
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

			{/* {series.length > 2 ? (
				<BookSlider
					className='book-reference__slider'
					title={`Series ${series.name}`}
					list={series}
					handleViewBookDetail={handleViewBookDetail}
				/>
			) : series.length > 0 ? (
				<Row>
					{series.map((item, index) => (
						<Col lg={6} md={12} key={index}>
							<Link to={`/book/detail/${item.id}`}>
								<div className='wants-to-read__thumbnail'>
									<img src={item.images[0] || bookImage} alt='' />
								</div>
							</Link>
						</Col>
					))}
				</Row>
			) : null} */}

			{relatedBooks.length > 0 && (
				<BookSlider
					className='book-reference__slider'
					title='Gợi ý cùng thể loại'
					list={relatedBooks}
					handleViewBookDetail={handleViewBookDetail}
				/>
			)}
			<div className='book-reference__highlight__post'>
				<h4>Bài viết nổi bật</h4>
				<div className='card card-link'>
					<ul className='card-link__list'>
						<li className='card-link__item'>
							<span>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</span>
						</li>
						<li className='card-link__item'>
							<span>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</span>
						</li>
						<li className='card-link__item'>
							<span>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</span>
						</li>
						<li className='card-link__item'>
							<span>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</span>
						</li>
					</ul>
				</div>
				<button className='sidebar__view-more-btn--blue' onClick={directNewUrl}>
					Xem thêm
				</button>
			</div>

			{allCategories.length > 0 && (
				<>
					<h4 className='statistic-title'>Chủ đề</h4>
					<div className='dualColumn'>
						<ul className='dualColumn-list'>
							{allCategories.length > 0 &&
								allCategories.slice(0, rows).map((item, index) => (
									<li className='dualColumn-item' key={index}>
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
