import React from 'react';
import Slider from 'react-slick';
import PropsTypes from 'prop-types';
import BookImage from 'shared/book-image';
import arrowNext from 'assets/images/arrow-chevron-forward.png';
import arrowPrev from 'assets/images/arrow-chevron-back.png';
import './book-slider.scss';

const BookSlider = ({ list, title }) => {
	const settingSlider = settings();
	if (list && list.length) {
		return (
			<div className='book-slider'>
				<h4 className='book-slider__title'>{title}</h4>
				<div className='book-slider__content'>
					<Slider {...settingSlider}>
						{list.map((item, index) => (
							<BookImage key={index} source={item.source} name={item.name} size='sm' />
						))}
					</Slider>
				</div>
			</div>
		);
	}

	return (
		<div className='book-slider'>
			<h4 className='book-slider__title'>Sách muốn đọc</h4>
			<p>Không có dữ liệu</p>
		</div>
	);
};

function SlideNextBtn({ className, style, onClick }) {
	return (
		<div className={className} style={{ ...style }} onClick={onClick}>
			<img src={arrowNext} alt='arrow-icon' />
		</div>
	);
}

function SlidePrevBtn({ className, style, onClick }) {
	return (
		<div className={className} style={{ ...style }} onClick={onClick}>
			<img src={arrowPrev} alt='arrow-icon' />
		</div>
	);
}

function settings() {
	return {
		dots: false,
		speed: 600,
		slidesToShow: 1,
		slidesToScroll: 2,
		initialSlide: 0,
		infinite: true,
		lazyLoad: false,
		autoplay: false,
		swipeToSlide: true,
		variableWidth: true,
		touchMove: true,
		nextArrow: <SlideNextBtn />,
		prevArrow: <SlidePrevBtn />,
		responsive: [
			{
				breakpoint: 1025,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				},
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 769,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 420,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 320,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};
}

BookSlider.defaultProps = {
	list: [],
	title: 'Sách muốn đọc',
};

BookSlider.propTypes = {
	list: PropsTypes.array.isRequired,
	title: PropsTypes.string.isRequired,
};

SlideNextBtn.propTypes = {
	className: PropsTypes.string,
	style: PropsTypes.object,
	onClick: PropsTypes.func,
};

SlidePrevBtn.propTypes = {
	className: PropsTypes.string,
	style: PropsTypes.object,
	onClick: PropsTypes.func,
};

export default BookSlider;
