import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { CloseX, Image, Pencil } from 'components/svg';
import _ from 'lodash';
import './style.scss';
import GridImage from 'shared/grid-image';
import { toast } from 'react-toastify';

const UploadImage = props => {
	const { addOptionsToPost, images, setImages, removeAllImages, maxFiles, maxSize } = props;

	const onDrop = useCallback(
		acceptedFiles => {
			if (!_.isEmpty(acceptedFiles)) {
				const newArrayFile = [...images, ...acceptedFiles];
				// Get files size
				let imagesSize = 0;
				for (let i = 0; i < newArrayFile.length; i++) {
					imagesSize += newArrayFile[i].size;
				}
				// Cảnh báo nếu đăng quá nhiều ảnh
				if (newArrayFile.length > maxFiles || imagesSize > maxSize) {
					warningLimited();
				} else {
					setImages(newArrayFile);
				}
			} else {
				const toastId = 'create-post-modal-content-upload-img';
				toast.warning('Chỉ được chọn ảnh PNG, JPG, JPEG và không được quá 3MB', { toastId: toastId });
			}
		},
		[images]
	);

	const warningLimited = () => {
		const customId = 'custom-id-UploadImage';
		toast.warning(
			`Chỉ được đăng tối đa ${maxFiles} ảnh hoặc tổng dung lượng không quá ${Math.floor(maxSize / 1048576)} MB`,
			{
				toastId: customId,
			}
		);
	};

	const { getRootProps, getInputProps } = useDropzone({
		accept: ['.png', '.jpeg', '.jpg'],
		onDrop,
		multiple: true,
		maxSize: 3000000,
	});

	if (images.length) {
		return (
			<div className='create-post-modal-content__main__body__image-container'>
				<div className='create-post-modal-content__main__body__image-box'>
					<GridImage images={images} inPost={false} />
					<div className='create-post-modal-content__main__body__image-options'>
						<div className='create-post-modal-content__main__body__image-options__block-left'>
							<button
								className='create-post-modal-content__main__body__image-options__button'
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
									className='create-post-modal-content__main__body__image-options__button'
								>
									<Image />
									<span>Thêm ảnh</span>
								</label>
							</div>
						</div>
						<button
							className='create-post-modal-content__main__body__image-options__delete-image'
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

UploadImage.defaultProps = {
	maxFiles: 10,
	maxSize: 1024,
};

UploadImage.propTypes = {
	taggedData: PropTypes.object,
	handleAddToPost: PropTypes.func,
	addOptionsToPost: PropTypes.func,
	setImages: PropTypes.func,
	images: PropTypes.array,
	removeAllImages: PropTypes.func,
	maxFiles: PropTypes.number,
	maxSize: PropTypes.number,
};

export default UploadImage;
