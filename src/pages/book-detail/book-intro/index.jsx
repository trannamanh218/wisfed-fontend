import PropTypes from 'prop-types';
import { useRef } from 'react';
import shareImg from 'assets/images/alert-circle-fill.png';
import facebookImg from 'assets/images/facebook.png';
import StatusButton from 'components/status-button';
import { CircleCheckFullFill } from 'components/svg';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import ReadMore from 'shared/read-more';
import './book-intro.scss';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FacebookShareButton } from 'react-share';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { handleSaveConfirmUserData } from 'reducers/redux-utils/book';

const BookIntro = ({ bookInfo, listRatingStar }) => {
	const userInfo = useSelector(state => state.auth.userInfo);
	const reviewsNumber = useSelector(state => state.book.currentBookReviewsNumber);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const urlShare = useRef(`${window.location.hostname + window.location.pathname}`);

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

	const onClickUserName = (userData, role) => {
		if (!_.isEmpty(userInfo)) {
			// Nếu tác giả đã được xác thực thì sang màn cá nhân, không thì sang màn xác thực
			if (userData.verify) {
				navigate(`/profile/${userData.authorId}`);
			} else {
				dispatch(
					handleSaveConfirmUserData({
						userId: userData.authorId ? userData.authorId : userData.translatorId,
						userName: userData.authorName ? userData.authorName : userData.translatorName,
						role: role,
					})
				);
				navigate(`/confirm-my-book/${bookInfo.id}/`);
			}
		} else {
			dispatch(checkUserLogin(true));
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
						<h1 className='book-intro__name' title={bookInfo.name}>
							{bookInfo.name}
						</h1>
						<div className='book-intro__author'>
							{Array.isArray(bookInfo.authors) && bookInfo.authors.length > 0 ? (
								<>
									Bởi
									{bookInfo.authors.map((author, index) => (
										<span key={index} className='book-intro__author__name'>
											<span
												className='verified'
												onClick={() => onClickUserName(author, 'author')}
											>
												{author.authorName}
											</span>
											{author.verify && <CircleCheckFullFill className='book-intro__check' />}
											{index + 1 < bookInfo.authors.length && ', '}
										</span>
									))}
								</>
							) : (
								'Chưa cập nhật tác giả'
							)}
						</div>

						{Array.isArray(bookInfo.translators) && bookInfo.translators.length > 0 && (
							<div className='book-intro__author'>
								Dịch giả
								{bookInfo.translators.map((translators, index) => (
									<span key={index} className='book-intro__author__name'>
										<span
											className='verified'
											onClick={() => onClickUserName(translators, 'translator')}
										>
											{translators.translatorName}
										</span>
										{/* {author.verify && <CircleCheckFullFill className='book-intro__check' />} */}
										{index + 1 < bookInfo.translators.length && ', '}
									</span>
								))}
							</div>
						)}

						<div className='book-intro__stars'>
							<ReactRating readonly={true} initialRating={listRatingStar?.avg} />
							{listRatingStar?.count > 0 && <span>({listRatingStar.count})</span>}
							<span>({reviewsNumber} reviews)</span>
						</div>
					</div>

					<div className='book-intro__description'>
						<ReadMore text={bookInfo.description || 'Chưa cập nhật'} />
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
