import Slider from 'react-slick';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import arrowNext from 'assets/images/arrow-chevron-forward.png';
import arrowPrev from 'assets/images/arrow-chevron-back.png';
import './book-slider.scss';
import classNames from 'classnames';
import { memo } from 'react';
import pencil from 'assets/images/pencil.png';

const BookSlider = ({
	list,
	title,
	className,
	size,
	handleViewBookDetail,
	inCategory,
	inResult,
	inCategoryDetail,
	handleShowModalSeries,
	editSeriesRole,
	...rest
}) => {
	const settingSlider = settings(inCategory, inCategoryDetail, inResult);

	return (
		<div className='main'>
			{!!list.length && (
				<div className={classNames('book-slider', { [`${className}`]: className })}>
					<h4 className='book-slider__title'>
						{title}

						{/* Dùng trong book-detail */}
						{editSeriesRole ? (
							<img
								className='edit-name__pencil'
								src={pencil}
								alt='pencil'
								title='Chỉnh sửa'
								onClick={handleShowModalSeries}
							/>
						) : (
							''
						)}
					</h4>

					<div className='book-slider__content'>
						{list?.length > 2 ? (
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
						) : (
							<div className='book-show'>
								{list.map((item, index) => (
									<div key={index}>
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
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
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

function settings(inCategory, inCategoryDetail, inResult) {
	return {
		dots: false,
		speed: 600,
		slidesToShow: inCategory || inResult ? 4 : 1,
		slidesToScroll: 2,
		initialSlide: 0,
		infinite: inCategoryDetail ? false : true,
		lazyLoad: false,
		autoplay: false,
		swipeToSlide: true,
		variableWidth: inCategory || inResult ? false : true,
		touchMove: true,
		nextArrow: <SlideNextBtn />,
		prevArrow: <SlidePrevBtn />,
		responsive: [
			{
				breakpoint: 1281,
				settings: {
					slidesToShow: inCategory ? 3 : 1,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 1025,
				settings: {
					slidesToShow: inCategory ? 4 : inResult ? 4 : 1,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: inCategory ? 3 : inResult ? 4 : 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 821,
				settings: {
					slidesToShow: inCategory ? 3 : inResult ? 3 : 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 769,
				settings: {
					slidesToShow: inCategory ? 3 : inResult ? 3 : 2,
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
	size: 'sm',
	handleViewBookDetail: () => {},
	editSeriesRole: false,
	inCategory: false,
	inResult: false,
	inCategoryDetail: false,
	handleShowModalSeries: () => {},
};

BookSlider.propTypes = {
	list: PropTypes.array.isRequired,
	title: PropTypes.string,
	className: PropTypes.string,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
	handleViewBookDetail: PropTypes.func,
	inCategory: PropTypes.bool,
	inCategoryDetail: PropTypes.bool,
	inResult: PropTypes.bool,
	handleShowModalSeries: PropTypes.func,
	editSeriesRole: PropTypes.bool,
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
