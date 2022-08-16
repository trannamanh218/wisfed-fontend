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
import { TOP_BOOK_VERB_SHARE } from 'constants/index';

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
}) => {
	const { userId } = useParams();
	const userInfo = useSelector(state => state.auth.userInfo);
	const dispatch = useDispatch();
	const navigate = useNavigate();

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

	const generateAuthorName = authorsInfo => {
		if (authorsInfo.length) {
			const authorNameArr = authorsInfo.map(item => item.authorName);
			return authorNameArr.join(' - ');
		} else {
			return 'Ẩn Danh';
		}
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
							{inPost ? generateAuthorName(data.info?.authors) : generateAuthorName(data.authors)}
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
							{/* {`${data.countRating || data.info.countRating || 'Chưa có'}` + ' đánh giá'} */}
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
			</div>
		)
	);
};

AuthorBook.defaultProps = {
	data: {},
	showShareBtn: false,
	inCreatePost: false,
	inPost: false,
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
	inPost: PropTypes.string,
};

export default AuthorBook;
