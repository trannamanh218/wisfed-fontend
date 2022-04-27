import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import StatusButton from 'components/status-button';
import './author-book.scss';
import { ShareRanks } from 'components/svg';

const AuthorBook = props => {
	const { data, checkStar, checkshare } = props;
	const authorsName = data?.authors.map(author => author.authorName);

	return (
		<div className='author-book'>
			<BookThumbnail images={data.images} />
			<div className='author-book__info'>
				<div className='author-book__header'>
					<h4 className='author-book__title' title={data.name}>
						{data.name}
					</h4>
					{checkshare && (
						<div className='author-book__share'>
							<ShareRanks />
						</div>
					)}
				</div>

				<p className='author-book__writers'>{authorsName?.join('- ')}</p>
				<div className='author-book__rating'>
					<ReactRating readonly={true} initialRating={4} checkStar={checkStar} />
					<span className='author-book__rating__number'>4.2 sao</span>
				</div>
				<div className='author-book__bottom'>
					<span className='author-book__stats'>1000 (đánh giá)</span>
					<StatusButton />
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
};

export default AuthorBook;
