import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './grid-image.scss';
import classNames from 'classnames';

const GridImage = ({ images, id }) => {
	useEffect(() => {
		if (images && images.length) {
			if (images.length === 1) {
				const img0 = document.querySelectorAll('.length-1.grid-image__item.img-0');
				Array.from(img0).forEach(img => {
					img.style.inset = '0%';
				});
			} else if (images.length === 2) {
				const img0 = document.querySelectorAll('.length-2.grid-image__item.img-0');
				Array.from(img0).forEach(img => {
					img.style.inset = '0% 0% 50% 0%';
				});

				const img1 = document.querySelectorAll('.length-2.grid-image__item.img-1');
				Array.from(img1).forEach(img => {
					img.style.inset = '50% 0% 0% 0%';
				});
			} else if (images.length === 3) {
				const img0 = document.querySelectorAll('.length-3.grid-image__item.img-0');
				Array.from(img0).forEach(img => {
					img.style.inset = '0% 0% 33.335% 0%';
				});

				const img1 = document.querySelectorAll('.length-3.grid-image__item.img-1');
				Array.from(img1).forEach(img => {
					img.style.inset = '66.67% 50% 0% 0%';
				});

				const img2 = document.querySelectorAll('.length-3.grid-image__item.img-2');
				Array.from(img2).forEach(img => {
					img.style.inset = '66.67% 0% 0% 50%';
				});
			} else if (images.length === 4) {
				const img0 = document.querySelectorAll('.length-4.grid-image__item.img-0');
				Array.from(img0).forEach(img => {
					img.style.inset = '0% 0% 33.335% 0%';
				});

				const img1 = document.querySelectorAll('.length-4.grid-image__item.img-1');
				Array.from(img1).forEach(img => {
					img.style.inset = '66.67% 66.67% 0% 0%';
				});

				const img2 = document.querySelectorAll('.length-4.grid-image__item.img-2');
				Array.from(img2).forEach(img => {
					img.style.inset = '66.67% 33.335% 0% 33.335%';
				});

				const img3 = document.querySelectorAll('.length-4.grid-image__item.img-3');
				Array.from(img3).forEach(img => {
					img.style.inset = '66.67% 0% 0% 66.67%';
				});
			} else if (images.length > 4) {
				const img0 = document.querySelectorAll('.length-5.grid-image__item.img-0');
				Array.from(img0).forEach(img => {
					img.style.inset = '0% 50% 50% 0%';
				});

				const img1 = document.querySelectorAll('.length-5.grid-image__item.img-1');
				Array.from(img1).forEach(img => {
					img.style.inset = '50% 50% 0% 0%';
				});

				const img2 = document.querySelectorAll('.length-5.grid-image__item.img-2');
				Array.from(img2).forEach(img => {
					img.style.inset = '0% 0% 66.67% 50%';
				});

				const img3 = document.querySelectorAll('.length-5.grid-image__item.img-3');
				Array.from(img3).forEach(img => {
					img.style.inset = '33.335% 0% 33.335% 50%';
				});

				const img4 = document.querySelectorAll('.length-5.grid-image__item.img-4');
				Array.from(img4).forEach(img => {
					img.style.inset = '66.67% 0% 0% 50%';
				});
			}
		}
	}, [images]);

	if (images && images.length > 5) {
		return (
			<div
				className={classNames('grid-image', {
					'one-image': images.length === 1,
					'more-one-image': images.length > 1,
				})}
			>
				<div className='grid-image__container'>
					{images.map((image, index) => {
						if (index < 4) {
							return (
								<div key={`post${id}-${index}`} className={`grid-image__item img-${index} length-5`}>
									<img src={image.streamPath || image} alt='image' />
								</div>
							);
						}
					})}
					<div key={`post${id}-${4}`} className={`grid-image__item img-4 length-5`}>
						<img src={images[4].streamPath || images[4]} alt='image' />
						<div className='grid-image__item-over'>+{images.length - 5}</div>
					</div>
				</div>
			</div>
		);
	} else if (images && images.length) {
		return (
			<div
				className={classNames('grid-image', {
					'one-image': images.length === 1,
					'more-one-image': images.length > 1,
				})}
			>
				<div className='grid-image__container'>
					{images.map((image, index) => (
						<div
							key={`post${id}-${index}`}
							className={`grid-image__item img-${index} length-${images.length}`}
						>
							<img src={image.streamPath || image} alt='image' />
						</div>
					))}
				</div>
			</div>
		);
	}

	return '';
};

GridImage.defaultProps = {
	images: [],
};

GridImage.propTypes = {
	images: PropTypes.array,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default GridImage;
