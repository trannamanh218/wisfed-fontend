import Slider from 'react-slick';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import arrowNext from 'assets/images/arrow-chevron-forward.png';
import arrowPrev from 'assets/images/arrow-chevron-back.png';
import './book-slider.scss';
import classNames from 'classnames';
import { memo } from 'react';

const BookSlider = ({
	list,
	title = '',
	className,
	size = 'sm',
	handleViewBookDetail,
	inCategory = false,
	inCategoryDetail = false,
	...rest
}) => {
	const settingSlider = settings(inCategory, inCategoryDetail);

	return (
		<>
			{!!list.length && (
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
									handleClick={handleViewBookDetail}
								/>
							))}
						</Slider>
					</div>
				</div>
			)}
		</>
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

function settings(inCategory, inCategoryDetail) {
	return {
		dots: false,
		speed: 600,
		slidesToShow: inCategory ? 4 : 1,
		slidesToScroll: 2,
		initialSlide: 0,
		infinite: inCategoryDetail ? false : true,
		lazyLoad: false,
		autoplay: false,
		swipeToSlide: true,
		variableWidth: inCategory ? false : true,
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
	handleViewBookDetail: () => {},
};

BookSlider.propTypes = {
	list: PropTypes.array.isRequired,
	title: PropTypes.string,
	className: PropTypes.string,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
	handleViewBookDetail: PropTypes.func,
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

export default memo(BookSlider);
