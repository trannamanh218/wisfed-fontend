import classNames from 'classnames';
import StatusButton from 'components/status-button';
import { ShareRanks } from 'components/svg';
import { TOP_BOOK_VERB_SHARE, TOP_BOOK_VERB_SHARE_LV1 } from 'constants/index';
import Storage from 'helpers/Storage';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { saveDataShare } from 'reducers/redux-utils/post';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import './author-book.scss';
import CreatePostModalContent from 'pages/home/components/newfeed/components/create-post-modal-content';
import { blockAndAllowScroll } from 'api/blockAndAllowScroll.hook';
import RouteLink from 'helpers/RouteLink';

const AuthorBook = ({
	data,
	checkStar,
	showShareBtn,
	setModalShow,
	topBooksId,
	valueDate,
	categoryName,
	inCreatePost,
	inPost,
	trueRank,
	saveLocalStorage,
}) => {
	const [saveLocalSearch, setSaveLocalSearch] = useState([]);
	const [showModalCreatePost, setShowModalCreatePost] = useState(false);

	const { userId } = useParams();
	const userInfo = useSelector(state => state.auth.userInfo);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	blockAndAllowScroll(showModalCreatePost);

	const handleShare = data => {
		const newData = {
			by: valueDate,
			categoryId: topBooksId || null,
			categoryName: categoryName || null,
			type: 'topBook',
			id: data.bookId,
			verb: TOP_BOOK_VERB_SHARE_LV1,
			trueRank: trueRank,
			...data,
		};

		if (Storage.getAccessToken()) {
			dispatch(saveDataShare(newData));
			setShowModalCreatePost(true);
		} else {
			setModalShow(true);
		}
	};

	const generateBookThumbnailSrc = data => {
		if (data?.book?.frontBookCover) {
			return data.book.frontBookCover;
		} else if (data?.info && data.info?.images.length > 0) {
			return data.info.images[0];
		} else if (data?.book && data.book?.images.length > 0) {
			return data.book.images[0];
		} else if (data?.frontBookCover) {
			return data.frontBookCover;
		} else if (data?.images && data.images.length > 0) {
			return data.images[0];
		} else {
			return '';
		}
	};

	const generateAuthorName = authorsInfo => {
		if (authorsInfo && authorsInfo.length) {
			const authorNameArr = authorsInfo.map(item => item.authorName);
			return authorNameArr.join(' - ');
		} else {
			return 'Ẩn Danh';
		}
	};

	const generateCountRating = countRating => {
		if (countRating) {
			return `${countRating} đánh giá`;
		} else {
			return 'Chưa có đánh giá';
		}
	};

	useEffect(() => {
		const getDataLocal = JSON.parse(localStorage.getItem('result'));
		if (getDataLocal) {
			setSaveLocalSearch(getDataLocal);
		}
	}, []);

	const onBookTitleOrThumbnailClick = () => {
		if (saveLocalStorage) {
			if (!saveLocalSearch.some(e => e.id === data.id)) {
				saveLocalSearch.unshift(data);
				localStorage.setItem('result', JSON.stringify(saveLocalSearch.slice(0, 8)));
			}
		}
		if (data.info) {
			navigate(RouteLink.bookDetail(data.info.id, data.info.name));
		} else {
			navigate(RouteLink.bookDetail(data.id, data.name));
		}
	};

	return (
		<>
			{!_.isEmpty(data) && (
				<div
					className={classNames('author-book', {
						'author-book-custom': data.verb === TOP_BOOK_VERB_SHARE,
					})}
				>
					<BookThumbnail source={generateBookThumbnailSrc(data)} handleClick={onBookTitleOrThumbnailClick} />
					<div className='author-book__info'>
						<div className='author-book__info__book-name-and-authors'>
							<div className='author-book__info__book-name'>
								<h4
									onClick={onBookTitleOrThumbnailClick}
									className='author-book__title'
									title={data.book?.name || data?.name || data.info?.name}
								>
									{data.book?.name || data?.name || data.info?.name}
								</h4>
								{showShareBtn && (
									<div onClick={() => handleShare(data)} className='author-book__share'>
										<ShareRanks />
									</div>
								)}
							</div>
							<p className='author-book__authors'>
								{inPost
									? generateAuthorName(data.info?.authors)
									: generateAuthorName(data.authors || data.info?.authors)}
							</p>
						</div>
						<div className='author-book__rating'>
							<ReactRating
								readonly={true}
								initialRating={data.avgRating?.toFixed(1) || data.info?.avgRating?.toFixed(1)}
								checkStar={checkStar}
							/>
							<span className='author-book__rating__number'>
								{data?.avgRating?.toFixed(1) ||
									data?.rateAvg?.toFixed(1) ||
									data.info?.avgRating?.toFixed(1) ||
									0}{' '}
								sao
							</span>
						</div>
						<div className='author-book__bottom'>
							<span className='author-book__stats'>
								{inPost
									? generateCountRating(data.info?.countRating)
									: generateCountRating(data.countRating || data.info?.countRating)}
							</span>

							{!_.isEmpty(userInfo) && userInfo.role === 'author' && userId === userInfo.id ? (
								<></>
							) : (
								<StatusButton
									bookData={inPost ? data.info : data}
									inCreatePost={inCreatePost}
									bookStatus={data.status}
								/>
							)}
						</div>
					</div>
					{showModalCreatePost && <CreatePostModalContent setShowModalCreatePost={setShowModalCreatePost} />}
				</div>
			)}
		</>
	);
};

AuthorBook.defaultProps = {
	data: {},
	showShareBtn: false,
	inCreatePost: false,
	inPost: false,
	trueRank: null,
	saveLocalStorage: false,
};

AuthorBook.propTypes = {
	data: PropTypes.object,
	checkStar: PropTypes.bool,
	showShareBtn: PropTypes.bool,
	setModalShow: PropTypes.func,
	valueDate: PropTypes.string,
	topBooksId: PropTypes.any,
	categoryName: PropTypes.string,
	inCreatePost: PropTypes.bool,
	inPost: PropTypes.bool,
	trueRank: PropTypes.number,
	saveLocalStorage: PropTypes.bool,
};

export default AuthorBook;
