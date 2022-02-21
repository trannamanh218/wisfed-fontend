import React from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import arrowNext from 'assets/images/arrow-chevron-forward.png';
import arrowPrev from 'assets/images/arrow-chevron-back.png';
import './book-slider.scss';
import classNames from 'classnames';

const BookSlider = ({ list, title = '', className, size = 'sm', ...rest }) => {
	const settingSlider = settings();
	if (list && list.length) {
		return (
			<div className={classNames('book-slider', { [`${className}`]: className })}>
				<h4 className='book-slider__title'>{title}</h4>
				<div className='book-slider__content'>
					<Slider {...settingSlider}>
						{list.map((item, index) => (
							<BookThumbnail
								key={index}
								{...item}
								data={item}
								source={item.source}
								name={item.name}
								size={size}
								{...rest}
							/>
						))}
					</Slider>
				</div>
			</div>
		);
	}

	return (
		<div className={classNames('book-slider', { [`${className}`]: className })}>
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
	title: '',
	className: '',
};

BookSlider.propTypes = {
	list: PropTypes.array.isRequired,
	title: PropTypes.string,
	className: PropTypes.string,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

SlideNextBtn.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
};

SlidePrevBtn.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
};

export default BookSlider;
