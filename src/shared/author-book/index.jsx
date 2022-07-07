import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import StatusButton from 'components/status-button';
import './author-book.scss';
import { ShareRanks } from 'components/svg';
import Storage from 'helpers/Storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sharePostsAll, saveDataShare } from 'reducers/redux-utils/post';
import classNames from 'classnames';

const AuthorBook = props => {
	const { data, checkStar, checkshare, setModalShow, topBooksId, valueDate } = props;
	const { isSharePostsAll } = useSelector(state => state.post);
	const authorsName = data.authors?.map(author => author?.authorName);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleShare = () => {
		const newData = {
			by: valueDate,
			type: 'topBook',
			categoryId: topBooksId || null,
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

	return (
		<div className={data.verb === 'shareTopBookRanking' && 'creat-post-modal-content__main__share-container'}>
			<div
				className={classNames('author-book', {
					'author-book-custom': isSharePostsAll === 'shareTopBook' || data.verb === 'shareTopBookRanking',
				})}
			>
				<BookThumbnail source={data.info ? data.info?.images[0] : data?.book?.images || data?.images[0]} />
				<div className='author-book__info'>
					<div className='author-book__header'>
						<h4 className='author-book__title' title={data.book?.name || data?.name || data.info?.name}>
							{data.book?.name || data?.name || data.info?.name}
						</h4>
						{checkshare && (
							<div onClick={handleShare} className='author-book__share'>
								<ShareRanks />
							</div>
						)}
					</div>

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
								? `${data?.countRating || data.info.countRating} (đánh giá)`
								: '0 (đánh giá)'}
						</span>
						<StatusButton
							bookData={data.info || data.book || data}
							status={data.status ? data.status : data.info.status}
						/>
					</div>
				</div>
			</div>
		</div>
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
};

export default AuthorBook;
