import { useState, useEffect } from 'react';
import shareImg from 'assets/images/alert-circle-fill.png';
import facebookImg from 'assets/images/facebook.png';
import StatusButton from 'components/status-button';
import { CircleCheckIcon } from 'components/svg';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import ReadMore from 'shared/read-more';
import './book-intro.scss';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { convertToPlainString } from 'helpers/Common';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRatingBook } from 'reducers/redux-utils/book';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { FacebookShareButton } from 'react-share';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';

const BookIntro = () => {
	const { bookInfo } = useSelector(state => state.book);
	const reviewsNumber = useSelector(state => state.book.currentBookReviewsNumber);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [lisRatingStar, setLisRatingStar] = useState({});
	const [urlShare, seturlShare] = useState('');
	const [textLength, setTextLength] = useState(450);

	const handleClick = () => {
		if (location.pathname !== '/' || location.pathname !== '/home') {
			navigate('/');
		}
	};

	const fetchData = async () => {
		try {
			const res = await dispatch(getRatingBook(bookInfo?.id)).unwrap();
			setLisRatingStar(res.data);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		fetchData();
		if (window.innerWidth <= 1024 && window.innerWidth > 800) {
			setTextLength(300);
		} else if (window.innerWidth < 770) {
			setTextLength(250);
		}
	}, []);

	const handleShareFaceBook = () => {
		if (Storage.getAccessToken()) {
			dispatch(checkUserLogin(false));
			seturlShare('https://peing.net/ja/');
		} else {
			dispatch(checkUserLogin(true));
		}
	};

	return (
		<div className='book-intro'>
			<div className='book-intro__image'>
				<BookThumbnail name='book' {...bookInfo} size='lg' />
				<StatusButton
					className='book-intro__btn'
					handleClick={handleClick}
					bookData={bookInfo}
					status={bookInfo.status}
					hasBookStatus={false}
				/>
			</div>
			<div className='book-intro__content'>
				<h1 className='book-intro__name'>{bookInfo.name}</h1>
				<div className='book-intro__author'>
					<span>Bởi {!_.isEmpty(bookInfo.authors) ? bookInfo.authors[0].authorName : 'Chưa cập nhật'} </span>
					<CircleCheckIcon className='book-intro__check' />
				</div>
				<div className='book-intro__stars'>
					<ReactRating readonly={true} initialRating={lisRatingStar?.avg} />
					<span>({lisRatingStar?.count} đánh giá)</span>
					<span>({reviewsNumber} review)</span>
				</div>

				<div className='book-intro__description'>
					<ReadMore
						text={convertToPlainString(bookInfo.description) || 'Chưa cập nhật'}
						length={textLength}
					/>
				</div>
				<FacebookShareButton url={urlShare} quote='Phải chăng ta đã yêu' hashtag=''>
					<div onClick={handleShareFaceBook} className='book-intro__action'>
						<div className='book-intro__share'>
							<img src={shareImg} alt='share' />
							<span className='book-intro__share__text'>Chia sẻ</span>
						</div>

						<div className='book-intro__share'>
							<img src={facebookImg} alt='facebook' />
						</div>
					</div>
				</FacebookShareButton>
			</div>
		</div>
	);
};

export default BookIntro;
