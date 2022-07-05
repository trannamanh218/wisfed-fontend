import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import StatusButton from 'components/status-button';
import './author-book.scss';
import { ShareRanks } from 'components/svg';
import Storage from 'helpers/Storage';

const AuthorBook = props => {
	const { data, checkStar, checkshare, setModalShow } = props;
	const authorsName = data.authors?.map(author => author?.authorName);
	const handleShare = () => {
		if (Storage.getAccessToken()) {
			// navigate('/');
		} else {
			setModalShow(true);
		}
	};

	return (
		<div className='author-book'>
			<BookThumbnail source={data?.book?.images || data?.images[0]} />
			<div className='author-book__info'>
				<div className='author-book__header'>
					<h4 className='author-book__title' title={data.book?.name || data?.name}>
						{data.book?.name || data?.name}
					</h4>
					{checkshare && (
						<div onClick={handleShare} className='author-book__share'>
							<ShareRanks />
						</div>
					)}
				</div>

				<p className='author-book__writers'>{authorsName && authorsName.join('- ')}</p>
				<div className='author-book__rating'>
					<ReactRating readonly={true} initialRating={data.avgRating} checkStar={checkStar} />
					<span className='author-book__rating__number'>{data?.avgRating || data?.rateAvg || 0} sao</span>
				</div>
				<div className='author-book__bottom'>
					<span className='author-book__stats'>
						{data?.countRating ? `${data?.countRating} (đánh giá)` : '0 (đánh giá)'}
					</span>
					<StatusButton bookData={data} status={data.status} />
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
};

export default AuthorBook;
