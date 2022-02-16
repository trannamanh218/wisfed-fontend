import React from 'react';
import shareImg from 'assets/images/alert-circle-fill.png';
import facebookImg from 'assets/images/facebook.png';
import StatusButton from 'components/status-button';
import { CircleCheckIcon } from 'components/svg';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import ReadMore from 'shared/read-more';
import './book-intro.scss';

const BookIntro = () => {
	return (
		<div className='book-intro'>
			<div className='book-intro__image'>
				<BookThumbnail name='book' source='../images/book1.jpg' size='lg' />
				<StatusButton className='book-intro__btn' />
			</div>
			<div className='book-intro__content'>
				<h1 className='book-intro__name'>
					The Mystery of Briony Lodge - Bí mật của Briony Lodge bản dịch 2021
				</h1>
				<div className='book-intro__author'>
					<span>By Christ Bohajalian</span>
					<CircleCheckIcon className='book-intro__check' />
				</div>
				<div className='book-intro__stars'>
					<ReactRating readonly={true} initialRating={4} />
					<span>(09 đánh giá)</span>
					<span>(4000 review)</span>
				</div>

				<div className='book-intro__description'>
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
				<div className='book-intro__action'>
					<div className='book-intro__share'>
						<img src={shareImg} alt='share' />
						<span className='book-intro__share__text'>Chia sẻ</span>
					</div>
					<div className='book-intro__share'>
						<img src={facebookImg} alt='facebook' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookIntro;
