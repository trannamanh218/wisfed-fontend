import PropTypes from 'prop-types';
import bookImage from 'assets/images/default-book.png';
import './book-thumbnail.scss';
import classNames from 'classnames';

const BookThumbnail = ({ images, source, name, size, handleClick, className, data }) => {
	return (
		<div
			className={classNames(`book-thumbnail book-thumbnail-${size}`, { [`${className}`]: className })}
			onClick={() => {
				handleClick(data);
			}}
			title={name}
		>
			<img
				src={images[0] || source || bookImage}
				alt={name}
				onError={e => e.target.setAttribute('src', `${bookImage}`)}
			/>
		</div>
	);
};

BookThumbnail.defaultProps = {
	images: [],
	source: '',
	name: '',
	size: 'md',
	className: '',
	data: {},
	handleClick: () => {},
};

BookThumbnail.propTypes = {
	source: PropTypes.string,
	images: PropTypes.array,
	name: PropTypes.string,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
	handleClick: PropTypes.func,
	className: PropTypes.string,
	data: PropTypes.object,
};

export default BookThumbnail;
