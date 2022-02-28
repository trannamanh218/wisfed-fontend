import './main-confirm-my-book.scss';
import { BackArrow, Flag, CheckIcon, CircleCheckIcon, Attach } from 'components/svg';
import BookThumbnail from 'shared/book-thumbnail';
import ReadMore from 'shared/read-more';
import confirmMyBookImage from 'assets/images/confirm-my-book.png';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import classNames from 'classnames';

function MainConfirmMyBook() {
	const [images, setImages] = useState([]);

	const onDrop = useCallback(acceptedFiles => {
		if (!_.isEmpty(acceptedFiles)) {
			const newArrayFile = [...images, ...acceptedFiles];
			setImages(newArrayFile);
		}
	});

	const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop, multiple: true });

	return (
		<div className='main-confirm-my-book'>
			<div className='main-confirm-my-book__back-btn'>
				<button>
					<BackArrow />
				</button>
				<span>Xác thực sách của tôi</span>
			</div>
			<div className='main-confirm-my-book__book-info'>
				<div className='main-confirm-my-book__image'>
					<BookThumbnail name='book' source='../images/book1.jpg' size='lg' />
					<div className='main-confirm-my-book__check'>
						<CheckIcon />
						<span>Sách của tôi</span>
					</div>
				</div>
				<div className='main-confirm-my-book__book-info-content'>
					<div className='main-confirm-my-book__hash-tags'>
						<div className='main-confirm-my-book__hash-tag-item'>#Kinh doanh</div>
						<div className='main-confirm-my-book__hash-tag-item'>#Kinh tế</div>
					</div>
					<div className='main-confirm-my-book__book-name'>
						How to win Fluent Friends Đắc Nhân Tâm (Phiên bản đặc biệt)
					</div>
					<div className='main-confirm-my-book__author-name'>
						<Flag />
						<span>Tác giả @phuong_anh_nul2k3</span>
					</div>
					<div className='main-confirm-my-book__description'>
						<ReadMore
							text={`	When literature student Anastasia Steele goes to house of interview young entrepreneur Christian
						Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The
						unworldly housing When literature student Anastasia Steele goes to house of interview young
						entrepreneur Christian Grey, she is encounters a man who is beautiful, brilliant, and only one
						When literature student Anastasia Steele goes to house of interview young entrepreneur Christian
						Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The
						unworldly housing When literature student Anastasia Steele goes to house of interview young
						entrepreneur Christian Grey, she is encounters a man who is beautiful, brilliant, and only one
						intimidating. Grey, she is encounters a man who is beautiful, brilliant, and only one
						intimidating. The unworldly housing When literature student Anastasia Steele goes to house of
						interview young entrepreneur Christian Grey, she is encounters a man who is beautiful,
						brilliant, and only one intimidating.
					`}
						/>
					</div>
				</div>
			</div>

			<div className='main-confirm-my-book__terms'>
				<div className='main-confirm-my-book__terms__header'>Cam kết điều khoản</div>
				<div className='main-confirm-my-book__terms__body'>
					When literature student Anastasia Steele goes to house of interview young entrepreneur Christian
					Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The unworldly
					housing When literature student Anastasia Steele goes to house of interview young entrepreneur
					Christian Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The
					unworldly housingWhen literature student Anastasia Steele goes to house of interview young
					entrepreneur Christian Grey, she is encounters a man who is beautiful, brilliant, and only one
					intimidating. The unworldly housing When literature student Anastasia Steele goes to house of
					interview young entrepreneur Christian Grey, she is encounters a man who is beautiful, brilliant,
					and only one intimidating. The unworldly housingWhen literature student Anastasia Steele goes to
					house of interview young entrepreneur Christian Grey, she is encounters a man who is beautiful,
					brilliant, and only one intimidating. The unworldly housing When literature student Anastasia Steele
					goes to house of interview young entrepreneur Christian Grey, she is encounters a man who is
					beautiful, brilliant, and only one intimidating. The unworldly housingWhen literature student
					Anastasia Steele goes to house of interview young entrepreneur Christian Grey, she is encounters a
					man who is beautiful, brilliant, and only one intimidating. The unworldly housing When literature
					student Anastasia Steele goes to house of interview young entrepreneur Christian Grey, she is
					encounters a man who is beautiful, brilliant, and only one intimidating. The unworldly housing When
					literature student Anastasia Steele goes to house of interview young entrepreneur Christian Grey,
					she is encounters a man who is beautiful, brilliant, and only one intimidating. The unworldly
					housing When literature student Anastasia Steele goes to house of interview young entrepreneur
					Christian Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The
					unworldly housing
				</div>
				<div className='main-confirm-my-book__terms__footer'>
					<CircleCheckIcon />
					<span>Tôi đồng ý với các điều khoản</span>
				</div>
			</div>
			<div className='main-confirm-my-book__confirm'>
				<div className='main-confirm-my-book__confirm__block-left'>
					<div className='main-confirm-my-book__confirm__text-1'>Xác thực chứng nhận</div>
					<div className='main-confirm-my-book__confirm__text-2'>Upload ảnh chứng nhận của bạn</div>
					<div {...getRootProps({ className: 'main-confirm-my-book__confirm__upload-images' })}>
						<input {...getInputProps()} />
						<Attach />
						<span>Tải ảnh lên</span>
					</div>
					<>
						{images.length > 0 && (
							<div className='main-confirm-my-book__confirm__images-uploaded'>
								{images.map((image, index) => {
									if (index < 2) {
										return (
											<div key={index} className='main-confirm-my-book__confirm__image-item'>
												<img src={URL.createObjectURL(image)} alt='image' />
											</div>
										);
									}
								})}
								{images.length >= 3 && (
									<div className='main-confirm-my-book__confirm__image-item'>
										<img src={URL.createObjectURL(images[2])} alt='image' />
										<div
											className={classNames('main-confirm-my-book__confirm__image-over', {
												'show': images.length > 3,
											})}
										>
											+{images.length - 3}
										</div>
									</div>
								)}
							</div>
						)}
					</>
					<button className='main-confirm-my-book__confirm__submit'>
						<CircleCheckIcon />
						<span>Gửi xác thực</span>
					</button>
				</div>
				<div className='main-confirm-my-book__confirm__block-right'>
					<img src={confirmMyBookImage} alt='image' />
				</div>
			</div>
		</div>
	);
}

export default MainConfirmMyBook;
