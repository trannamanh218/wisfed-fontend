import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import StatusButton from 'components/status-button';
import './author-book.scss';
import { ShareRanks } from 'components/svg';
import Storage from 'helpers/Storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { saveDataShare } from 'reducers/redux-utils/post';
import classNames from 'classnames';
import _ from 'lodash';
import { TOP_BOOK_VERB_SHARE } from 'constants';
import { useState, useEffect } from 'react';

const AuthorBook = ({
	data,
	checkStar,
	showShareBtn,
	setModalShow,
	topBooksId,
	valueDate,
	categoryName,
	inCreatePost,
	position,
}) => {
	const [bookData, setBookdata] = useState({ authors: [], countRating: null });

	const { userId } = useParams();
	const userInfo = useSelector(state => state.auth.userInfo);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		generateCountRatingAndAuthorsName();
	}, []);

	const handleShare = data => {
		const newData = {
			by: valueDate,
			categoryId: topBooksId || null,
			categoryName: categoryName || null,
			type: 'topBook',
			id: data.bookId,
			verb: TOP_BOOK_VERB_SHARE,
			...data,
		};

		if (Storage.getAccessToken()) {
			navigate('/');
			dispatch(saveDataShare(newData));
		} else {
			setModalShow(true);
		}
	};

	const generateBookThumbnailSrc = data => {
		if (data?.info && data.info?.images.length > 0) {
			return data.info.images[0];
		} else if (data?.book && data.book?.images.length > 0) {
			return data.book.images[0];
		} else if (data?.images && data.images.length > 0) {
			return data.images[0];
		} else {
			return '';
		}
	};

	const generateCountRatingAndAuthorsName = () => {
		const bookDataTemp = { ...bookData };
		if (position === 'createPostModal') {
			if (data.authors && data.authors.length) {
				bookDataTemp.authors = data.authors?.map(author => author?.authorName);
			} else if (data.book && data.book.authors && data.book.authors.length) {
				bookDataTemp.authors = data.book.authors?.map(author => author?.authorName);
			}
			if (data.countRating) {
				bookDataTemp.countRating = data.countRating;
			} else if (data.book && data.book.countRating) {
				bookDataTemp.countRating = data.book.countRating;
			}
		} else if (position === 'profile') {
			console.log('author book in profile');
		} else if (position === 'topBook') {
			if (data.book.authors && data.book.authors.length) {
				bookDataTemp.authors = data.book.authors?.map(author => author?.authorName);
			}
			if (data.book.countRating) {
				bookDataTemp.countRating = data.book.countRating;
			}
		} else if (position === 'bookSearch') {
			if (data.authors && data.authors.length) {
				bookDataTemp.authors = data.authors?.map(author => author?.authorName);
			}
			bookDataTemp.countRating = data.countRating;
		} else if (position === 'post') {
			if (data.info.authors && data.info.authors.length) {
				bookDataTemp.authors = data.info.authors?.map(author => author?.authorName);
			}
			if (data.info.countRating) {
				bookDataTemp.countRating = data.info.countRating;
			}
		}
		setBookdata(bookDataTemp);
	};

	return (
		!_.isEmpty(data) && (
			<div
				className={classNames('author-book', {
					'author-book-custom': data.verb === TOP_BOOK_VERB_SHARE,
				})}
			>
				<BookThumbnail
					source={generateBookThumbnailSrc(data)}
					handleClick={() => navigate(`/book/detail/${data.info?.id || data.bookId || data.id}`)}
				/>
				<div className='author-book__info'>
					<div className='author-book__info__book-name-and-authors'>
						<div className='author-book__info__book-name'>
							<Link to={`/book/detail/${data.info?.id || data.bookId || data.id}`}>
								<h4
									className='author-book__title'
									title={data.book?.name || data?.name || data.info?.name}
								>
									{data.book?.name || data?.name || data.info?.name}
								</h4>
							</Link>
							{showShareBtn && (
								<div onClick={() => handleShare(data)} className='author-book__share'>
									<ShareRanks />
								</div>
							)}
						</div>
						<p className='author-book__authors'>
							{bookData.authors.length ? bookData.authors.join('- ') : 'Ẩn danh'}
						</p>
					</div>
					<div className='author-book__rating'>
						<ReactRating
							readonly={true}
							initialRating={data.avgRating?.toFixed(1) || data.info?.countRating?.toFixed(1)}
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
							{`${bookData.countRating ? bookData.countRating : 'Chưa có'}` + ' đánh giá'}
						</span>
						{!_.isEmpty(userInfo) && userInfo.role === 'author' && userId === userInfo.id ? (
							<></>
						) : (
							<StatusButton
								bookData={inCreatePost ? data : data.info}
								inCreatePost={inCreatePost}
								hasBookStatus={true}
							/>
						)}
					</div>
				</div>
			</div>
		)
	);
};

AuthorBook.defaultProps = {
	data: {},
	showShareBtn: false,
	inCreatePost: false,
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
	position: PropTypes.string,
};

export default AuthorBook;
