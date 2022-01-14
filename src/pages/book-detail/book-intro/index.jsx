import React from 'react';
import bookImg from 'assets/images/book1.png';
import { CircleCheckIcon } from 'components/svg';
import shareIcon from 'assets/icons/share.svg';
import StatusButton from 'components/status-button';

const BookIntro = () => {
	return (
		<div className='book-intro'>
			<div className='book-intro__image'>
				<img src={bookImg} alt='book-image' />
				<StatusButton />
			</div>
			<div className='book-intro__content'>
				<h1 className='book-intro__name'>
					The Mystery of Briony Lodge - Bí mật của Briony Lodge bản dịch 2021
				</h1>
				<div className='book-intro__author'>
					<span>By Christ Bohajalian</span>
					<CircleCheckIcon />
				</div>
				<div className='book-intro__stars'>
					<div className='stars'></div>
					<span>(09 đánh giá)</span>
					<span>(4000 review)</span>
				</div>
				<p className='book-intro__description'>
					When literature student Anastasia Steele goes to house of interview young entrepreneur Christian
					Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The unworldly
					housing When literature student Anastasia Steele goes to house of interview young entrepreneur
					Christian Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The
					unworldly housing ...
					<span>Continue reading</span>
				</p>
				<div className='book-intro__action'>
					<div className='book-intro__share'>
						<img src={shareIcon} alt='share' />
						<span>Chia sẻ</span>
					</div>

					<span className='book-intro__share__icon book-intro__share__icon--facebook'></span>
				</div>
			</div>
		</div>
	);
};

export default BookIntro;
