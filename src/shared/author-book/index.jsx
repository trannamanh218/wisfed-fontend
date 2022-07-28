import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import StatusButton from 'components/status-button';
import './author-book.scss';
import { ShareRanks } from 'components/svg';
import Storage from 'helpers/Storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { sharePostsAll, saveDataShare } from 'reducers/redux-utils/post';
import classNames from 'classnames';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';

const AuthorBook = props => {
	const { data, checkStar, checkshare, setModalShow, topBooksId, valueDate, categoryName } = props;
	const { isSharePostsAll } = useSelector(state => state.post);
	const authorsName = data.authors?.map(author => author?.authorName);

	const { userId } = useParams();
	const userInfo = useSelector(state => state.auth.userInfo);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleShare = () => {
		const newData = {
			by: valueDate,
			type: 'topBook',
			categoryId: topBooksId || null,
			categoryName: categoryName || null,
			...data,
		};
		if (Storage.getAccessToken()) {
			navigate('/');
			dispatch(saveDataShare(newData));
			dispatch(sharePostsAll('shareTopBook'));
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

	return (
		!_.isEmpty(data) && (
			<div
				className={data.verb === 'shareTopBookRanking' ? 'creat-post-modal-content__main__share-container' : ''}
			>
				<div
					className={classNames('author-book', {
						'author-book-custom': isSharePostsAll === 'shareTopBook' || data.verb === 'shareTopBookRanking',
					})}
				>
					<BookThumbnail
						source={generateBookThumbnailSrc(data)}
						handleClick={() => navigate(`/book/detail/${data.bookId || data.id}`)}
					/>
					<div className='author-book__info'>
						<Row>
							<Col xs={10}>
								<Link to={`/book/detail/${data.bookId || data.id}`}>
									<h4
										className='author-book__title'
										title={data.book?.name || data?.name || data.info?.name}
									>
										{data.book?.name || data?.name || data.info?.name}
									</h4>
								</Link>
							</Col>
							<Col xs={2}>
								{checkshare && (
									<div onClick={handleShare} className='author-book__share'>
										<ShareRanks />
									</div>
								)}
							</Col>
						</Row>
						<p className='author-book__writers'>{authorsName && authorsName.join('- ')}</p>
						<div className='author-book__rating'>
							<ReactRating
								readonly={true}
								initialRating={data.avgRating || data.info?.countRating}
								checkStar={checkStar}
							/>
							<span className='author-book__rating__number'>
								{data?.avgRating || data?.rateAvg || data.info?.avgRating || 0} sao
							</span>
						</div>
						<div className='author-book__bottom'>
							<span className='author-book__stats'>
								{data?.countRating
									? `${data?.countRating || data.info.countRating} đánh giá`
									: 'Chưa có đánh giá'}
							</span>
							{!_.isEmpty(userInfo) && userInfo.role === 'author' && userId === userInfo.id ? (
								<></>
							) : (
								<StatusButton bookData={data} />
							)}
						</div>
					</div>
				</div>
			</div>
		)
	);
};

AuthorBook.defaultProps = {
	data: {},
};

AuthorBook.propTypes = {
	data: PropTypes.object,
	checkStar: PropTypes.bool,
	checkshare: PropTypes.bool,
	setModalShow: PropTypes.func,
	valueDate: PropTypes.string,
	topBooksId: PropTypes.number,
	categoryName: PropTypes.string,
};

export default AuthorBook;
