import React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './grid-image.scss';
import classNames from 'classnames';
import _ from 'lodash';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const GridImage = ({ images, inPost, postId }) => {
	const [show, setShow] = React.useState(false);
	const handleShow = () => setShow(true);
	const [photoIndex, setPhotoIndex] = React.useState(0);
	const [isOpent, setIsOpent] = React.useState(false);

	useEffect(() => {
		if (!_.isEmpty(images)) {
			if (inPost) {
				if (images.length === 1) {
					document.querySelector(`.img-0-${postId}`).style.inset = '0%';
					if (images[0].includes('charts')) {
						document.querySelector(`.img-0-${postId} img`).style.height = 'fit-content';
						document.querySelector(`.img-0-${postId} img`).style.objectFit = 'unset';
					}
				} else if (images.length === 2) {
					document.querySelector(`.img-0-${postId}`).style.inset = '0% 0% 50% 0%';
					document.querySelector(`.img-1-${postId}`).style.inset = '50% 0% 0% 0%';
				} else if (images.length === 3) {
					document.querySelector(`.img-0-${postId}`).style.inset = '0% 0% 33.335% 0%';
					document.querySelector(`.img-1-${postId}`).style.inset = '66.67% 50% 0% 0%';
					document.querySelector(`.img-2-${postId}`).style.inset = '66.67% 0% 0% 50%';
				} else if (images.length === 4) {
					document.querySelector(`.img-0-${postId}`).style.inset = '0% 0% 33.335% 0%';
					document.querySelector(`.img-1-${postId}`).style.inset = '66.67% 66.67% 0% 0%';
					document.querySelector(`.img-2-${postId}`).style.inset = '66.67% 33.335% 0% 33.335%';
					document.querySelector(`.img-4-${postId}`).style.inset = '66.67% 0% 0% 66.67%';
				} else if (images.length > 4) {
					document.querySelector(`.img-0-${postId}`).style.inset = '0% 0% 25% 0%';
					document.querySelector(`.img-1-${postId}`).style.inset = '75% 75% 0% 0%';
					document.querySelector(`.img-2-${postId}`).style.inset = '75% 50% 0% 25%';
					document.querySelector(`.img-3-${postId}`).style.inset = '75% 25% 0% 50%';
					document.querySelector(`.img-4-${postId}`).style.inset = '75% 0% 0% 75%';
				}
			} else {
				if (images.length === 1) {
					document.querySelector(`.img-0`).style.inset = '0%';
				} else if (images.length === 2) {
					document.querySelector(`.img-0`).style.inset = '0% 0% 50% 0%';
					document.querySelector(`.img-1`).style.inset = '50% 0% 0% 0%';
				} else if (images.length === 3) {
					document.querySelector(`.img-0`).style.inset = '0% 0% 33.335% 0%';
					document.querySelector(`.img-1`).style.inset = '66.67% 50% 0% 0%';
					document.querySelector(`.img-2`).style.inset = '66.67% 0% 0% 50%';
				} else if (images.length === 4) {
					document.querySelector(`.img-0`).style.inset = '0% 0% 33.335% 0%';
					document.querySelector(`.img-1`).style.inset = '66.67% 66.67% 0% 0%';
					document.querySelector(`.img-2`).style.inset = '66.67% 33.335% 0% 33.335%';
					document.querySelector(`.img-4`).style.inset = '66.67% 0% 0% 66.67%';
				} else if (images.length > 4) {
					document.querySelector(`.img-0`).style.inset = '0% 0% 25% 0%';
					document.querySelector(`.img-1`).style.inset = '75% 75% 0% 0%';
					document.querySelector(`.img-2`).style.inset = '75% 50% 0% 25%';
					document.querySelector(`.img-3`).style.inset = '75% 25% 0% 50%';
					document.querySelector(`.img-4`).style.inset = '75% 0% 0% 75%';
				}
			}
		}
	}, [images]);

	return (
		<>
			{!_.isEmpty(images) && (
				<div
					onClick={handleShow}
					className={classNames('grid-image', {
						'one-image': images.length === 1,
						'more-one-image': images.length > 1,
						'add-margin': inPost,
					})}
				>
					{images.length < 6 ? (
						<>
							{images.map((image, index) => (
								<button key={index} onClick={() => setIsOpent(true)}>
									<div
										key={index}
										className={
											inPost
												? `creat-post-modal-content__main__body__image img-${index}-${postId}`
												: `creat-post-modal-content__main__body__image img-${index}`
										}
									>
										{inPost ? (
											<img src={image} alt='image' />
										) : (
											<img src={URL.createObjectURL(image)} alt='image' />
										)}
									</div>
									{isOpent && (
										<Lightbox
											mainSrc={images[photoIndex]}
											nextSrc={images[(photoIndex + 1) % images.length]}
											prevSrc={images[(photoIndex + images.length - 1) % images.length]}
											onCloseRequest={() => setIsOpent(false)}
											onMovePrevRequest={() =>
												setPhotoIndex((photoIndex + images.length - 1) % images.length)
											}
											onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
										/>
									)}
								</button>
							))}
						</>
					) : (
						<>
							{images.length >= 6 && (
								<>
									{images.map((image, index) => {
										if (index < 4) {
											return (
												<button onClick={() => setIsOpent(true)}>
													<div
														key={index}
														className={
															inPost
																? `creat-post-modal-content__main__body__image img-${index}-${postId}`
																: `creat-post-modal-content__main__body__image img-${index}`
														}
													>
														{inPost ? (
															<img src={image} alt='image' />
														) : (
															<img src={URL.createObjectURL(image)} alt='image' />
														)}
													</div>
													{isOpent && (
														<Lightbox
															mainSrc={images[photoIndex]}
															nextSrc={images[(photoIndex + 1) % images.length]}
															prevSrc={
																images[(photoIndex + images.length - 1) % images.length]
															}
															onCloseRequest={() => setIsOpent(false)}
															onMovePrevRequest={() =>
																setPhotoIndex(
																	(photoIndex + images.length - 1) % images.length
																)
															}
															onMoveNextRequest={() =>
																setPhotoIndex((photoIndex + 1) % images.length)
															}
														/>
													)}
												</button>
											);
										}
										{
											isOpent && (
												<Lightbox
													mainSrc={images[photoIndex]}
													nextSrc={images[(photoIndex + 1) % images.length]}
													prevSrc={images[(photoIndex + images.length - 1) % images.length]}
													onCloseRequest={() => setIsOpent(false)}
													onMovePrevRequest={() =>
														setPhotoIndex({
															photoIndex:
																(photoIndex + images.length - 1) % images.length,
														})
													}
													onMoveNextRequest={() =>
														setPhotoIndex({
															photoIndex: (photoIndex + 1) % images.length,
														})
													}
												/>
											);
										}
									})}
									<div
										className={
											inPost
												? `creat-post-modal-content__main__body__image img-4-${postId}`
												: `creat-post-modal-content__main__body__image img-4`
										}
									>
										{inPost ? (
											<img src={images[4]} alt='image' />
										) : (
											<img src={URL.createObjectURL(images[4])} alt='image' />
										)}
										<div className='creat-post-modal-content__main__body__image-over'>
											+{images.length - 5}
										</div>
									</div>
								</>
							)}
						</>
					)}
				</div>
			)}
		</>
	);
};

GridImage.defaultProps = {
	images: [],
};

GridImage.propTypes = {
	images: PropTypes.array,
	inPost: PropTypes.bool,
	postId: PropTypes.string,
};

export default GridImage;
