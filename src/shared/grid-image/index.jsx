import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './grid-image.scss';
import classNames from 'classnames';
import _ from 'lodash';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { useRef } from 'react';

const GridImage = ({ images, inPost, postId, isEditPost }) => {
	const [photoIndex, setPhotoIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
	const html = safeDocument.documentElement;

	const scrollBlocked = useRef(false);

	useEffect(() => {
		if (!_.isEmpty(images)) {
			if (inPost) {
				if (images.length === 1) {
					document.querySelector(`.img-0-${postId}`).style.inset = '0%';
					if (images[0].includes('charts')) {
						document.querySelector(`.img-0-${postId} img`).style.height = '100%';
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
					document.querySelector(`.img-3-${postId}`).style.inset = '66.67% 0% 0% 66.67%';
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
					document.querySelector(`.img-3`).style.inset = '66.67% 0% 0% 66.67%';
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

	useEffect(() => {
		if (isOpen) {
			blockScroll();
		} else {
			allowScroll();
		}
	}, [isOpen]);

	const blockScroll = () => {
		if (!body || !body.style || scrollBlocked.current) return;
		const scrollBarWidth = window.innerWidth - html.clientWidth;
		const bodyPaddingRight = parseInt(window.getComputedStyle(body).getPropertyValue('padding-right')) || 0;
		body.style.position = 'relative';
		body.style.overflow = 'hidden';
		body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;
		scrollBlocked.current = true;
	};

	const allowScroll = () => {
		if (!body || !body.style || !scrollBlocked.current) return;
		html.style.position = '';
		html.style.overflow = '';
		body.style.position = '';
		body.style.overflow = '';
		body.style.paddingRight = '';
		scrollBlocked.current = false;
	};

	return (
		<>
			{!_.isEmpty(images) && (
				<div
					className={classNames('grid-image', {
						'one-image': images.length === 1,
						'more-one-image': images.length > 1,
						'add-margin': inPost,
					})}
				>
					{images.length < 6 ? (
						<>
							{images.map((image, index) => (
								<div
									className={
										inPost
											? `create-post-modal-content__main__body__image img-${index}-${postId}`
											: `create-post-modal-content__main__body__image img-${index}`
									}
									key={index}
									onClick={() => {
										setIsOpen(true);
										setPhotoIndex(index);
									}}
								>
									{inPost || isEditPost ? (
										<img src={image} alt='image' />
									) : (
										<img src={URL.createObjectURL(image)} alt='image' />
									)}
								</div>
							))}
							{isOpen && (
								<Lightbox
									mainSrc={images[photoIndex]}
									nextSrc={images[(photoIndex + 1) % images.length]}
									prevSrc={images[(photoIndex + images.length - 1) % images.length]}
									onCloseRequest={() => setIsOpen(false)}
									onMovePrevRequest={() =>
										setPhotoIndex((photoIndex + images.length - 1) % images.length)
									}
									onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
								/>
							)}
						</>
					) : (
						<>
							{images.length >= 6 && (
								<>
									{images.map((image, index) => {
										if (index < 4) {
											return (
												<div
													className={
														inPost
															? `create-post-modal-content__main__body__image img-${index}-${postId}`
															: `create-post-modal-content__main__body__image img-${index}`
													}
													key={index}
													onClick={() => {
														setIsOpen(true);
														setPhotoIndex(index);
													}}
												>
													{inPost || isEditPost ? (
														<img src={image} alt='image' />
													) : (
														<img src={URL.createObjectURL(image)} alt='image' />
													)}
												</div>
											);
										}
									})}
									<div
										className={
											inPost
												? `create-post-modal-content__main__body__image img-4-${postId}`
												: `create-post-modal-content__main__body__image img-4`
										}
										onClick={() => {
											setIsOpen(true);
											setPhotoIndex(4);
										}}
									>
										{inPost ? (
											<img src={images[4]} alt='image' />
										) : (
											<img src={URL.createObjectURL(images[4])} alt='image' />
										)}
										<div className='create-post-modal-content__main__body__image-over'>
											+{images.length - 4}
										</div>
									</div>
									{isOpen && (
										<Lightbox
											mainSrc={images[photoIndex]}
											nextSrc={images[(photoIndex + 1) % images.length]}
											prevSrc={images[(photoIndex + images.length - 1) % images.length]}
											onCloseRequest={() => setIsOpen(false)}
											onMovePrevRequest={() =>
												setPhotoIndex((photoIndex + images.length - 1) % images.length)
											}
											onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
										/>
									)}
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
	isEditPost: false,
};

GridImage.propTypes = {
	images: PropTypes.array,
	inPost: PropTypes.bool,
	postId: PropTypes.any,
	isEditPost: PropTypes.bool,
};

export default GridImage;
