import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { CloseX, Image, Pencil } from 'components/svg';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { uploadImage } from 'reducers/redux-utils/common';
import './style.scss';
import { STATUS_IDLE, STATUS_SUCCESS } from 'constants';
import { STATUS_LOADING } from 'constants';
import GridImage from 'shared/grid-image';

const UploadImage = props => {
	const { addOptionsToPost, handleAddToPost, taggedData } = props;
	const dispatch = useDispatch();
	const images = taggedData.addImages;
	const [status, setStatus] = useState(STATUS_IDLE);

	const uploadFiles = acceptedFiles => {
		const fileList = acceptedFiles.map(item => {
			const params = {
				data: { file: [item] },
				// onUploadProgress: progressEvent => {
				// 	const { loaded, total } = progressEvent;
				// 	const percent = Math.floor((loaded * 100) / total);
				// },
			};
			return dispatch(uploadImage(params)).unwrap();
		});

		Promise.all(fileList)
			.then(res => {
				const resData = res.map(item => item.streamPath);
				if (!_.isEmpty(resData)) {
					const imgList = [...taggedData.addImages, ...resData];
					handleAddToPost(imgList);
				}

				setStatus(STATUS_SUCCESS);
			})
			.catch(err => {
				toast.error('Lỗi hệ thống không thể upload ảnh');
			})
			.finally(() => {
				setStatus(STATUS_IDLE);
			});
	};

	const onDrop = useCallback(acceptedFiles => {
		if (!_.isEmpty(acceptedFiles)) {
			setStatus(STATUS_LOADING);
			uploadFiles(acceptedFiles);
		}
	});
	const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop, multiple: true });

	const removeImages = () => {
		handleAddToPost([]);
	};

	if (images.length) {
		return (
			<div className='creat-post-modal-content__main__body__image-container'>
				<div className='creat-post-modal-content__main__body__image-box'>
					<GridImage images={images} id='post-create' />
					<div className='creat-post-modal-content__main__body__image-options'>
						<div className='creat-post-modal-content__main__body__image-options__block-left'>
							<button
								className='creat-post-modal-content__main__body__image-options__button'
								onClick={e => {
									e.stopPropagation();
									addOptionsToPost({
										value: 'modifyImages',
										title: 'chỉnh sửa ảnh',
									});
								}}
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
							onClick={e => {
								e.stopPropagation();
								removeImages();
							}}
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

UploadImage.propTypes = {
	taggedData: PropTypes.object,
	handleAddToPost: PropTypes.func,
	addOptionsToPost: PropTypes.func,
};

export default UploadImage;
