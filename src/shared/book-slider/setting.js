import arrowNext from 'assets/images/arrow-chevron-forward.png';
import arrowPrev from 'assets/images/arrow-chevron-back.png';
import PropsTypes from 'prop-types';

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

const settings = {
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

export default settings;
