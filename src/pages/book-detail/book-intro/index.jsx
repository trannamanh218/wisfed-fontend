import React, { useState, useEffect } from 'react';
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

const BookIntro = () => {
	const { bookInfo } = useSelector(state => state.book);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [lisRatingStar, setLisRatingStar] = useState({});

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
	}, []);

	return (
		<div className='book-intro'>
			<div className='book-intro__image'>
				<BookThumbnail name='book' {...bookInfo} size='lg' />
				<StatusButton
					className='book-intro__btn'
					handleClick={handleClick}
					bookData={bookInfo}
					status={bookInfo.status}
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
					<span>(4000 review)</span>
				</div>

				<div className='book-intro__description'>
					<ReadMore text={convertToPlainString(bookInfo.description) || 'Chưa cập nhật'} />
				</div>
				<FacebookShareButton url='https://peing.net/ja/' quote='Phải chăng ta đã yêu' hashtag=''>
					<div className='book-intro__action'>
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
