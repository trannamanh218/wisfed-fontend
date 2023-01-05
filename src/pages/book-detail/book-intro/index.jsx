import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import shareImg from 'assets/images/alert-circle-fill.png';
import facebookImg from 'assets/images/facebook.png';
import StatusButton from 'components/status-button';
import { CircleCheckIcon } from 'components/svg';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import ReadMore from 'shared/read-more';
import './book-intro.scss';
import _ from 'lodash';
import { convertToPlainString } from 'helpers/Common';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FacebookShareButton } from 'react-share';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import classNames from 'classnames';

const BookIntro = ({ bookInfo, listRatingStar }) => {
	const [textLength, setTextLength] = useState(500);

	const userInfo = useSelector(state => state.auth.userInfo);
	const reviewsNumber = useSelector(state => state.book.currentBookReviewsNumber);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const urlShare = useRef(`${window.location.hostname + window.location.pathname}`);

	useEffect(() => {
		if (window.innerWidth <= 768) {
			setTextLength(280);
		} else if (window.innerWidth <= 820) {
			setTextLength(320);
		} else if (window.innerWidth <= 1024) {
			setTextLength(380);
		} else if (window.innerWidth <= 1280) {
			setTextLength(400);
		}
	}, []);

	const handleClick = () => {
		if (location.pathname !== '/' || location.pathname !== '/home') {
			navigate('/');
		}
	};

	const handleShareFaceBook = () => {
		if (Storage.getAccessToken()) {
			dispatch(checkUserLogin(false));
		} else {
			dispatch(checkUserLogin(true));
		}
	};

	const handleConfirmMyBook = () => {
		if (!_.isEmpty(userInfo)) {
			if (!bookInfo.verify) {
				navigate(`/confirm-my-book/${bookInfo.id}`);
			}
		} else {
			dispatch(checkUserLogin(true));
		}
	};

	const viewAuthorProfile = authorId => {
		if (bookInfo.verify) {
			navigate(`/profile/${authorId}`);
		}
	};

	return (
		<div className='book-intro'>
			<div className='book-intro__image'>
				<BookThumbnail {...bookInfo} size='lg' />
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
							{Array.isArray(bookInfo.authors) && bookInfo.authors.length > 0 ? (
								<>
									Bởi{' '}
									{bookInfo.authors.map((author, index) => (
										<span key={index}>
											<span
												className={classNames({
													'verified': bookInfo.verify,
												})}
												onClick={() => viewAuthorProfile(author.authorId)}
											>
												{author.authorName}
											</span>
											{index + 1 < bookInfo.authors.length && ', '}
										</span>
									))}
								</>
							) : (
								'Chưa cập nhật tác giả'
							)}

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
					<FacebookShareButton url={urlShare.current}>
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
