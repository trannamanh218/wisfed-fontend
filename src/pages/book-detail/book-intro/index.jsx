import PropTypes from 'prop-types';
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
import { useDispatch } from 'react-redux';
import { FacebookShareButton } from 'react-share';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import classNames from 'classnames';

const BookIntro = ({ bookInfo, listRatingStar }) => {
	const reviewsNumber = useSelector(state => state.book.currentBookReviewsNumber);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [urlShare, seturlShare] = useState('');
	const [textLength, setTextLength] = useState(500);

	const handleClick = () => {
		if (location.pathname !== '/' || location.pathname !== '/home') {
			navigate('/');
		}
	};

	useEffect(() => {
		if (window.innerWidth <= 768) {
			setTextLength(290);
		} else if (window.innerWidth <= 820) {
			setTextLength(320);
		} else if (window.innerWidth <= 1024) {
			setTextLength(380);
		} else if (window.innerWidth <= 1280) {
			setTextLength(400);
		}
	}, []);

	const handleShareFaceBook = () => {
		if (Storage.getAccessToken()) {
			dispatch(checkUserLogin(false));
			seturlShare(`${window.location.hostname + location.pathname}`);
		} else {
			dispatch(checkUserLogin(true));
		}
	};

	const handleConfirmMyBook = () => {
		if (!bookInfo.verify) {
			navigate(`/confirm-my-book/${bookInfo.id}`);
		}
	};

	const viewAuthorProfile = () => {
		if (bookInfo.verify) {
			navigate(`/profile/${bookInfo.authors[0].authorId}`);
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
					bookStatus={bookInfo.status}
				/>
			</div>
			<div className='book-intro__content'>
				<div className='book-intro__content__infomations'>
					<div className='book-intro__content__infomations__block-up'>
						<h1
							className={classNames('book-intro__name', {
								'not-verify': !bookInfo.verify,
							})}
							onClick={handleConfirmMyBook}
							title={bookInfo.name}
						>
							{bookInfo.name}
						</h1>
						<div className='book-intro__author'>
							<span onClick={viewAuthorProfile}>
								{!_.isEmpty(bookInfo.authors) ? (
									<span>
										Bời{' '}
										<span
											className={classNames({
												'verified': bookInfo.verify,
											})}
										>
											{bookInfo.authors[0].authorName}
										</span>
									</span>
								) : (
									'Chưa cập nhật tác giả'
								)}
							</span>
							{bookInfo.verify && <CircleCheckIcon className='book-intro__check' />}
						</div>
						<div className='book-intro__stars'>
							<ReactRating readonly={true} initialRating={listRatingStar?.avg} />
							{listRatingStar?.count > 0 && <span>({listRatingStar.count})</span>}
							<span>({reviewsNumber} reviews)</span>
						</div>
					</div>

					<div className='book-intro__description'>
						<ReadMore
							text={convertToPlainString(bookInfo.description) || 'Chưa cập nhật'}
							length={textLength}
						/>
					</div>
				</div>
				<div onClick={handleShareFaceBook} className='book-intro__action'>
					<FacebookShareButton url={urlShare}>
						<div className='book-intro__share'>
							<img src={shareImg} alt='share' />
							<span className='book-intro__share__text'>Chia sẻ</span>
						</div>
						<div className='book-intro__share'>
							<img src={facebookImg} alt='facebook' />
						</div>
					</FacebookShareButton>
				</div>
			</div>
		</div>
	);
};

export default BookIntro;

BookIntro.propTypes = {
	bookInfo: PropTypes.object,
	listRatingStar: PropTypes.object,
};
