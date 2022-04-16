import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { CloseX, Image, Pencil } from 'components/svg';
import _ from 'lodash';
import './style.scss';
import GridImage from 'shared/grid-image';

const UploadImage = props => {
	const { addOptionsToPost, images, setImages, removeAllImages } = props;

	const onDrop = useCallback(acceptedFiles => {
		if (!_.isEmpty(acceptedFiles)) {
			const newArrayFile = [...images, ...acceptedFiles];
			setImages(newArrayFile);
		}
	});

	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/*',
		onDrop,
		multiple: true,
	});

	if (images.length) {
		return (
			<div className='creat-post-modal-content__main__body__image-container'>
				<div className='creat-post-modal-content__main__body__image-box'>
					<GridImage images={images} inPost={false} />
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
							<div
								{...getRootProps({
									className: 'dropzone upload-image__options',
								})}
							>
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
							onClick={removeAllImages}
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
	setImages: PropTypes.func,
	images: PropTypes.array,
	removeAllImages: PropTypes.func,
};

export default UploadImage;
