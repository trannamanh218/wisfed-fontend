import arrowNext from 'assets/images/arrow-chevron-forward.png';
import arrowPrev from 'assets/images/arrow-chevron-back.png';
import PropTypes from 'prop-types';

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

const settingsSlider = {
	dots: false,
	speed: 600,
	slidesToShow: 8,
	slidesToScroll: 5,
	initialSlide: 0,
	infinite: false,
	lazyLoad: false,
	autoplay: false,
	swipeToSlide: true,
	variableWidth: true,
	touchMove: true,
	nextArrow: <SlideNextBtn />,
	prevArrow: <SlidePrevBtn />,
	// responsive: [
	// 	{
	// 		breakpoint: 1025,
	// 		settings: {
	// 			slidesToShow: 3,
	// 			slidesToScroll: 3,
	// 		},
	// 	},
	// 	{
	// 		breakpoint: 992,
	// 		settings: {
	// 			slidesToShow: 2,
	// 			slidesToScroll: 2,
	// 		},
	// 	},
	// 	{
	// 		breakpoint: 769,
	// 		settings: {
	// 			slidesToShow: 2,
	// 			slidesToScroll: 2,
	// 		},
	// 	},
	// 	{
	// 		breakpoint: 576,
	// 		settings: {
	// 			slidesToShow: 2,
	// 			slidesToScroll: 2,
	// 		},
	// 	},
	// 	{
	// 		breakpoint: 420,
	// 		settings: {
	// 			slidesToShow: 1,
	// 			slidesToScroll: 1,
	// 		},
	// 	},
	// 	{
	// 		breakpoint: 320,
	// 		settings: {
	// 			slidesToShow: 1,
	// 			slidesToScroll: 1,
	// 		},
	// 	},
	// ],
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

export default settingsSlider;
