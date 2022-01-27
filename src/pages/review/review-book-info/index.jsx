import React from 'react';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import ReadMore from 'shared/read-more';
import './review-book-info.scss';

const ReviewBookInfo = () => {
	return (
		<div className='review-book-info'>
			<BookThumbnail className='review-book-info__image' size='lg' />
			<div className='review-book-info__content'>
				<h1 className='review-book-info__name'>
					The Mystery of Briony Lodge - Bí mật của Briony Lodge bản dịch 2021
				</h1>
				<div className='review-book-info__author'>
					<span>By Christ Bohajalian</span>
				</div>
				<div className='review-book-info__stars'>
					<ReactRating readonly={true} initialRating={4} />
					<span>(09 đánh giá)</span>
					<span>(4000 review)</span>
				</div>

				<div className='review-book-info__description'>
					<ReadMore
						text={`	When literature student Anastasia Steele goes to house of interview young entrepreneur Christian
						Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The
						unworldly housing When literature student Anastasia Steele goes to house of interview young
						entrepreneur Christian Grey, she is encounters a man who is beautiful, brilliant, and only one
						When literature student Anastasia Steele goes to house of interview young entrepreneur Christian
						Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The
						unworldly housing When literature student Anastasia Steele goes to house of interview young
						entrepreneur Christian Grey, she is encounters a man who is beautiful, brilliant, and only one
						intimidating. Grey, she is encounters a man who is beautiful, brilliant, and only one
						intimidating. The unworldly housing When literature student Anastasia Steele goes to house of
						interview young entrepreneur Christian Grey, she is encounters a man who is beautiful,
						brilliant, and only one intimidating.
					`}
					/>
				</div>
			</div>
		</div>
	);
};

ReviewBookInfo.propTypes = {};

export default ReviewBookInfo;
