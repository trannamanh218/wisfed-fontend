import './post-book.scss';
import StatusButton from 'components/status-button';
import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

function PostBook({ postInformations }) {
	const postBookDescription = useRef(null);

	useEffect(() => {
		const width = window.innerWidth;
		if (width >= 1440) {
			postBookDescription.current.innerText = postBookDescription.current.innerText.slice(0, 195) + '...';
		} else if (width >= 1366 && width < 1440) {
			postBookDescription.current.innerText = postBookDescription.current.innerText.slice(0, 175) + '...';
		}
	}, []);

	return (
		<div className='post__book-container'>
			<div className='post__book__image'>
				<img data-testid='post__book__image' src={postInformations.bookImage} alt='' />
			</div>
			<div className='post__book__informations'>
				<div className='post__book__name-and-author'>
					<div data-testid='post__book__name' className='post__book__name'>
						{postInformations.bookName}
					</div>
					<div className='post__book__author'>Tác giả Christ Bohajalian</div>
				</div>
				<div className='post__book__button-and-rating'>
					<StatusButton />
					<ReactRating initialRating={3.3} readonly={true} fractions={2} />
					<div className='post__book__rating__number'>(09 đánh giá)</div>
				</div>
				<div className='post__book__description'>
					<span ref={postBookDescription}>
						When literature student Anastasia Steele goes to house of interview young entrepreneur Christian
						Grey, she is encounters a man who is beautiful, brilliant, and only one intimidaing.When Grey,
						she is encounters a man who is beautiful, brilliant, and only one intimidaing.When literature
						student Anastasia Steele goes to house of interview young entrepreneur Christian
					</span>
					<button className='post__book__description__continue-reading'>Continue reading</button>
				</div>
			</div>
		</div>
	);
}
PostBook.propTypes = {
	postInformations: PropTypes.object.isRequired,
};

export default PostBook;
