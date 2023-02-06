import arrowPrev from 'assets/images/arrow-chevron-back.png';
import arrowNext from 'assets/images/arrow-chevron-forward.png';
import pencil from 'assets/images/pencil.png';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { memo, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import BookThumbnail from 'shared/book-thumbnail';
import './book-slider.scss';

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
	const [slidesToShow, setSlidesToShow] = useState(2);

	const sliderContentElement = useRef(null);

	useEffect(() => {
		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const handleResize = () => {
		if (sliderContentElement.current) {
			const sliderWidth = sliderContentElement.current.offsetWidth;
			const itemWidth = sliderContentElement.current.querySelector('.book-thumbnail').offsetWidth;

			setSlidesToShow(Math.floor(sliderWidth / itemWidth));
		}
	};

	return (
		<div className='main'>
			{!!list.length && (
				<div className={classNames('book-slider', { [`${className}`]: className })}>
					<h2 className='book-slider__title'>
						{title}

						{/* Dùng trong book-detail */}
						{editSeriesRole && (
							<img
								className='edit-name__pencil'
								src={pencil}
								alt='pencil'
								title='Chỉnh sửa'
								onClick={handleShowModalSeries}
							/>
						)}
					</h2>

					<div className='book-slider__content' ref={sliderContentElement}>
						{list?.length > 2 ? (
							<Slider
								{...{
									dots: false,
									speed: 600,
									slidesToShow: slidesToShow,
									slidesToScroll: slidesToShow >= 4 ? 2 : 1,
									initialSlide: 0,
									infinite: inCategoryDetail ? false : true,
									lazyLoad: false,
									autoplay: false,
									swipeToSlide: true,
									variableWidth: inCategory || inResult ? false : true,
									touchMove: true,
									nextArrow: <SlideNextBtn />,
									prevArrow: <SlidePrevBtn />,
								}}
							>
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
