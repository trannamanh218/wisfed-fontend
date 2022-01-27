import arrowPrev from 'assets/images/arrow-chevron-back.png';
import arrowNext from 'assets/images/arrow-chevron-forward.png';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'react-slick';
import UserAvatar from 'shared/user-avatar';
import './author-slider.scss';

const AuthorSlider = ({ list, title, className, size = 'sm' }) => {
	const settingSlider = settings();
	if (list && list.length) {
		return (
			<div className={classNames('author-slider', { [`${className}`]: className })}>
				<h4 className='author-slider__title'>{title}</h4>
				<div className='author-slider__content'>
					<Slider {...settingSlider}>
						{list.map((item, index) => (
							<div key={index}>
								<div className='author-slider__item'>
									<UserAvatar source={item.source} name={item.name} size={size} />
									<p className='author-slider__item__creator'>Ms. Mai Phương</p>
								</div>
							</div>
						))}
					</Slider>
				</div>
			</div>
		);
	}

	return (
		<div className={classNames('author-slider', { [`${className}`]: className })}>
			<h4 className='author-slider__title'>Sách muốn đọc</h4>
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

AuthorSlider.defaultProps = {
	list: [],
	title: 'Sách muốn đọc',
	className: '',
};

AuthorSlider.propTypes = {
	list: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
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

export default AuthorSlider;
