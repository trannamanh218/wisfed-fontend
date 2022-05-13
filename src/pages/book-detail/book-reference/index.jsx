import { useFetchRelatedBooks } from 'api/book.hooks';
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
import { getCategoryList } from 'reducers/redux-utils/category';
import caretIcon from 'assets/images/caret.png';
import { Link } from 'react-router-dom';

const BookReference = () => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [allCategories, setAllCategories] = useState([]);
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(3);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { bookInfo } = useSelector(state => state.book);

	const { relatedBooks } = useFetchRelatedBooks(bookInfo.categoryId);

	const bookList = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });

	useEffect(() => {
		getAllCategories();
	}, []);

	const getAllCategories = async () => {
		try {
			const res = await dispatch(getCategoryList()).unwrap();
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

	const directNewUrl = () => {
		window.open('https://www.tecinus.vn');
	};

	return (
		<div className='book-reference'>
			<Circle loading={status === STATUS_LOADING} />
			{/* sách của tac gia */}
			<BookSlider
				className='book-reference__slider'
				title={`Sách của ${bookInfo.authors[0].authorName} `}
				list={bookList}
			/>
			{/* series sách đó */}
			<BookSlider className='book-reference__slider' title='Seris dạy con làm giàu' list={bookList} />
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
							<a>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</a>
						</li>
						<li className='card-link__item'>
							<a>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</a>
						</li>
						<li className='card-link__item'>
							<a>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</a>
						</li>
						<li className='card-link__item'>
							<a>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</a>
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
