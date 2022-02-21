import React, { useCallback, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { CloseX, Image, Pencil } from 'components/svg';
import { useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';
import _ from 'lodash';
import { uploadImage } from 'reducers/redux-utils/common';
import './style.scss';
import classNames from 'classnames';
// const MAX_FILES = 5;

const UploadImage = props => {
	// const { addOptionsToPost, optionList, handleOpenUploadImage } = props;
	const dispatch = useDispatch();
	const [images, setImages] = useState([]);

	useEffect(() => {
		if (images.length === 1) {
			document.querySelector('.img-0').style.inset = '0%';
		} else if (images.length === 2) {
			document.querySelector('.img-0').style.inset = '0% 0% 50% 0%';
			document.querySelector('.img-1').style.inset = '50% 0% 0% 0%';
		} else if (images.length === 3) {
			document.querySelector('.img-0').style.inset = '0% 0% 33.335% 0%';
			document.querySelector('.img-1').style.inset = '66.67% 50% 0% 0%';
			document.querySelector('.img-2').style.inset = '66.67% 0% 0% 50%';
		} else if (images.length === 4) {
			document.querySelector('.img-0').style.inset = '0% 0% 33.335% 0%';
			document.querySelector('.img-1').style.inset = '66.67% 66.67% 0% 0%';
			document.querySelector('.img-2').style.inset = '66.67% 33.335% 0% 33.335%';
			document.querySelector('.img-3').style.inset = '66.67% 0% 0% 66.67%';
		} else if (images.length > 4) {
			document.querySelector('.img-0').style.inset = '0% 50% 50% 0%';
			document.querySelector('.img-1').style.inset = '50% 50% 0% 0%';
			document.querySelector('.img-2').style.inset = '0% 0% 66.67% 50%';
			document.querySelector('.img-3').style.inset = '33.335% 0% 33.335% 50%';
			document.querySelector('.img-4').style.inset = '66.67% 0% 0% 50%';
		}
	}, [images]);

	const uploadFiles = acceptedFiles => {
		const params = {
			data: { file: acceptedFiles[0] },
		};

		addImages(acceptedFiles);
		dispatch(uploadImage(params))
			.unwrap()
			.then(() => {
				// console.log(res);
			})
			.catch(() => {
				// console.log(err	);
			});
		// 		const fileList = acceptedFiles.slice(0, MAX_FILES).map(item => {
		// 			const params = {
		// 				data: { file: item, type: 'books' },
		// 				onUploadProgress: progressEvent => {
		// 					const { loaded, total } = progressEvent;
		// 					const percent = Math.floor((loaded * 100) / total);
		//
		// 				},
		// 			};
		// 			return dispatch(uploadImageFile(params));
		// 		});

		// Promise.all(fileList)
		// 	.then(res => {
		// 		const resData = res.map(item => unwrapResult(item).uri);
		// 		if (!_.isEmpty(resData)) {
		// 			const imgList = [...data.image, ...resData];
		// 			setData({ ...data, image: imgList });
		// 		}
		// 	})
		// 	.catch(() => {
		// 		toast.error('Lỗi hệ thống');
		// 	})
		// 	.finally(() => {
		// 		setIsFetching(false);
		// 		fetchData();
		// 	});
	};

	const onDrop = useCallback(acceptedFiles => {
		if (!_.isEmpty(acceptedFiles)) {
			// if (acceptedFiles.length > MAX_FILES) {
			// 	toast.warn('Bạn không được chọn quá 5 ảnh');
			// }
			// setIsFetching(true);
			uploadFiles(acceptedFiles);
		}
	});
	const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop, multiple: true });

	const addImages = files => {
		const newArrayFile = [...images, ...files];
		setImages(newArrayFile);
	};

	const removeImages = () => {
		document.getElementById('image-upload').value = '';
		setImages([]);
	};

	if (images.length) {
		return (
			<div
				className={classNames('creat-post-modal-content__main__body__image-container', {
					'one-image': images.length === 1,
					'more-one-image': images.length > 1,
				})}
			>
				<div className='creat-post-modal-content__main__body__image-box'>
					{images.length > 0 && images.length < 6 ? (
						<>
							{images.map((image, index) => (
								<div key={index} className={`creat-post-modal-content__main__body__image img-${index}`}>
									<img src={URL.createObjectURL(image)} alt='image' />
								</div>
							))}
						</>
					) : (
						<>
							{images.length >= 6 && (
								<>
									{images.map((image, index) => {
										if (index < 4) {
											return (
												<div
													key={index}
													className={`creat-post-modal-content__main__body__image img-${index}`}
												>
													<img src={URL.createObjectURL(image)} alt='image' />
												</div>
											);
										}
									})}
									<div className={`creat-post-modal-content__main__body__image img-4`}>
										<img src={URL.createObjectURL(images[4])} alt='image' />
										<div className='creat-post-modal-content__main__body__image-over'>
											+{images.length - 5}
										</div>
									</div>
								</>
							)}
						</>
					)}
					<div className='creat-post-modal-content__main__body__image-options'>
						<div className='creat-post-modal-content__main__body__image-options__block-left'>
							<button
								className='creat-post-modal-content__main__body__image-options__button'
								// onClick={() => addOptionsToPost(optionList[length - 1])}
							>
								<Pencil />
								<span>Chỉnh sửa tất cả</span>
							</button>
							<div {...getRootProps({ className: 'dropzone upload-image__options' })}>
								<input {...getInputProps()} />
								<label
									htmlFor='image-upload'
									className='creat-post-modal-content__main__body__image-options__button'
								>
									<Image />
									<span>Thêm ảnh</span>
								</label>
							</div>
						</div>
						<button
							className='creat-post-modal-content__main__body__image-options__delete-image'
							onClick={removeImages}
						>
							<CloseX />
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='upload-image__wrapper'>
			<div {...getRootProps({ className: 'dropzone upload-image' })}>
				<input {...getInputProps()} />
				<Image className='upload-image__icon' />
				<p className='upload-image__description'>Thêm ảnh từ thiết bị</p>
				<span>hoặc kéo thả</span>
			</div>
		</div>
	);
};

UploadImage.propTypes = {};

export default UploadImage;
