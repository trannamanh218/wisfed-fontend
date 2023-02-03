import './main-confirm-my-book.scss';
import { BackArrow, Flag, CheckIcon, CircleCheckIcon, Attach } from 'components/svg';
import BookThumbnail from 'shared/book-thumbnail';
import ReadMore from 'shared/read-more';
import confirmMyBookImage from 'assets/images/confirm-my-book.png';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { uploadMultiFile, creatBookCopyrights, getListCopyrights } from 'reducers/redux-utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchBookDetail } from 'api/book.hooks';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import RouteLink from 'helpers/RouteLink';
import { handleSaveConfirmAuthorData } from 'reducers/redux-utils/book';

function MainConfirmMyBook({ setErrorLoadPage }) {
	const [images, setImages] = useState([]);
	const [status, setStatus] = useState('');
	const [validated, setValidated] = useState(false);

	const dispatch = useDispatch();
	const { bookId } = useParams();
	const navigate = useNavigate();
	const { bookInfo, errorFetch } = useFetchBookDetail(bookId);
	const userInfo = useSelector(state => state.auth.userInfo);
	const { confirmAuthorData } = useSelector(state => state.book);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		if (errorFetch || (bookInfo && bookInfo.isDeleted)) {
			setErrorLoadPage(true);
		}

		// Kiểm tra xem bạn đã xác thực sách này hay chưa
		if (!_.isEmpty(bookInfo) && Array.isArray(bookInfo.authors) && bookInfo.authors.length > 0) {
			const found = bookInfo.authors.find(item => item.authorId === userInfo.id);
			if (found && found.verify === true) {
				setValidated(true);
			}
		}
	}, [errorFetch, bookInfo]);

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			getCopyrightsData();
		}
	}, [userInfo]);

	useEffect(() => {
		// Nếu không có dữ liệu redux thì không cho truy cập màn này
		if (_.isEmpty(confirmAuthorData) && !_.isEmpty(bookInfo)) {
			handleNavigateToBookDetail();
		}
		// Xóa dữ liệu redux khi thoát khỏi màn này
		return () => {
			dispatch(handleSaveConfirmAuthorData({}));
		};
	}, [bookInfo]);

	const getCopyrightsData = async () => {
		try {
			const params = {
				filter: JSON.stringify([
					{ 'operator': 'eq', 'value': userInfo.id, 'property': 'createdBy' },
					{ 'operator': 'eq', 'value': Number(bookId), 'property': 'bookId' },
				]),
			};
			const res = await dispatch(getListCopyrights(params)).unwrap();
			const data = res.rows;
			if (data.length > 0) {
				setStatus(data[0].status);
				setImages(data[0].documents);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const onDrop = useCallback(
		acceptedFiles => {
			if (!_.isEmpty(acceptedFiles)) {
				const newArrayFile = [...images, ...acceptedFiles];
				setImages(newArrayFile);
			} else {
				const toastId = 'confirm-my-book-upload-img';
				toast.warning('Chỉ được chọn ảnh PNG, JPG, JPEG và không được quá 3MB', { toastId: toastId });
			}
		},
		[images]
	);

	const { getRootProps, getInputProps } = useDropzone({
		accept: ['.png', '.jpeg', '.jpg'],
		onDrop,
		multiple: true,
		maxSize: 3000000,
	});

	const submitConfirm = async () => {
		try {
			const data = [];
			for (let i = 0; i < images.length; i++) {
				data.push(images[i]);
			}
			const imagesUploadedData = await dispatch(uploadMultiFile(data)).unwrap();
			const imagesUploaded = [];
			imagesUploadedData.forEach(item => imagesUploaded.push(item.streamPath.default));
			const dataCopyrights = {
				'bookId': Number(bookId),
				'content': '',
				'documents': imagesUploaded,
				'phone': '',
				'address': userInfo.address || '',
				'status': 'pending',
				'authorId': String(confirmAuthorData.authorId),
			};
			const creatBookCopyrightsResponse = await dispatch(creatBookCopyrights(dataCopyrights)).unwrap();
			if (creatBookCopyrightsResponse) {
				const customId = 'custom-id-MainConfirmMyBook-success';
				toast.success('Gửi Yêu cầu thành công', { toastId: customId });
				navigate('/');
			}
		} catch {
			const customId = 'custom-id-MainConfirmMyBook-error';
			toast.error('Gửi yêu cầu không thành công', { toastId: customId });
		} finally {
			setImages([]);
			setChecked(false);
		}
	};

	useEffect(() => {
		setImages([]);
	}, []);

	const handleNavigateToBookDetail = () => {
		navigate(RouteLink.bookDetail(bookInfo.id, bookInfo.name));
	};

	return (
		<>
			{!_.isEmpty(bookInfo) && (
				<div className='main-confirm-my-book'>
					<div className='main-confirm-my-book__back-btn'>
						<div className='back-btn' onClick={handleNavigateToBookDetail}>
							<BackArrow />
						</div>
						<span>Xác thực sách của tôi</span>
					</div>
					<div className='main-confirm-my-book__book-info'>
						<div className='main-confirm-my-book__image'>
							<BookThumbnail source={bookInfo.frontBookCover || bookInfo.images[0]} size='lg' />
							<div className='main-confirm-my-book__check'>
								{validated ? (
									<>
										<CheckIcon />
										<span>Sách của tôi</span>
									</>
								) : (
									<span>Đang chờ xác thực</span>
								)}
							</div>
						</div>
						<div className='main-confirm-my-book__book-info-content'>
							<div className='main-confirm-my-book__hash-tags'>
								{!!bookInfo.categories.length && (
									<div className='main-confirm-my-book__hash-tag-item'>
										#{bookInfo.categories[0].category.name}
									</div>
								)}
							</div>
							<div className='main-confirm-my-book__book-name'>{bookInfo.name}</div>
							<div className='main-confirm-my-book__author-name'>
								<Flag />
								{bookInfo.authors.length > 0 ? (
									<span>Tác giả {confirmAuthorData.authorName}</span>
								) : (
									'Chưa có tác giả'
								)}
							</div>
							<div className='main-confirm-my-book__description'>
								<ReadMore text={bookInfo.description} height={200} />
							</div>
						</div>
					</div>

					<div className='main-confirm-my-book__terms'>
						<div className='main-confirm-my-book__terms__header'>Cam kết điều khoản</div>
						<div className='main-confirm-my-book__terms__body'>
							When literature student Anastasia Steele goes to house of interview young entrepreneur
							Christian Grey, she is encounters a man who is beautiful, brilliant, and only one
							intimidating. The unworldly housing When literature student Anastasia Steele goes to house
							of interview young entrepreneur Christian Grey, she is encounters a man who is beautiful,
							brilliant, and only one intimidating. The unworldly housingWhen literature student Anastasia
							Steele goes to house of interview young entrepreneur Christian Grey, she is encounters a man
							who is beautiful, brilliant, and only one intimidating. The unworldly housing When
							literature student Anastasia Steele goes to house of interview young entrepreneur Christian
							Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The
							unworldly housingWhen literature student Anastasia Steele goes to house of interview young
							entrepreneur Christian Grey, she is encounters a man who is beautiful, brilliant, and only
							one intimidating. The unworldly housing When literature student Anastasia Steele goes to
							house of interview young entrepreneur Christian Grey, she is encounters a man who is
							beautiful, brilliant, and only one intimidating. The unworldly housingWhen literature
							student Anastasia Steele goes to house of interview young entrepreneur Christian Grey, she
							is encounters a man who is beautiful, brilliant, and only one intimidating. The unworldly
							housing When literature student Anastasia Steele goes to house of interview young
							entrepreneur Christian Grey, she is encounters a man who is beautiful, brilliant, and only
							one intimidating. The unworldly housing When literature student Anastasia Steele goes to
							house of interview young entrepreneur Christian Grey, she is encounters a man who is
							beautiful, brilliant, and only one intimidating. The unworldly housing When literature
							student Anastasia Steele goes to house of interview young entrepreneur Christian Grey, she
							is encounters a man who is beautiful, brilliant, and only one intimidating. The unworldly
							housing
						</div>
						<div className='main-confirm-my-book__terms__footer'>
							{checked ? (
								<CircleCheckIcon onClick={() => setChecked(false)} />
							) : (
								<div className='checkbox-circle' onClick={() => setChecked(true)}></div>
							)}
							<span>Tôi đồng ý với các điều khoản</span>
						</div>
					</div>
					<div className='main-confirm-my-book__confirm'>
						<div className='main-confirm-my-book__confirm__block-left'>
							<div className='main-confirm-my-book__confirm__text-1'>Xác thực chứng nhận</div>
							<div className='main-confirm-my-book__confirm__text-2'>Upload ảnh chứng nhận của bạn</div>
							<button
								{...getRootProps({
									className: classNames('main-confirm-my-book__confirm__upload-images', {
										'disable': validated,
									}),
								})}
								disabled={validated ? true : false}
							>
								<input {...getInputProps()} />
								<Attach />
								<span>Tải ảnh lên</span>
							</button>

							{images.length > 0 && (
								<div className='main-confirm-my-book__confirm__images-uploaded'>
									{images.map((image, index) => {
										if (index < 2) {
											return (
												<div key={index} className='main-confirm-my-book__confirm__image-item'>
													{status ? (
														<img src={image} alt='image' />
													) : (
														<img src={URL.createObjectURL(image)} alt='image' />
													)}
												</div>
											);
										}
									})}
									{images.length >= 3 && (
										<div className='main-confirm-my-book__confirm__image-item'>
											{status ? (
												<img src={images[2]} alt='image' />
											) : (
												<img src={URL.createObjectURL(images[2])} alt='image' />
											)}
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

							<button
								className={`main-confirm-my-book__confirm__submit ${
									(validated || !images.length || !checked) && 'disabled-btn'
								}`}
								onClick={submitConfirm}
							>
								<CircleCheckIcon />
								<span>Gửi xác thực</span>
							</button>
						</div>
						<div className='main-confirm-my-book__confirm__block-right'>
							<img src={confirmMyBookImage} alt='image' />
						</div>
					</div>
				</div>
			)}
		</>
	);
}

MainConfirmMyBook.propTypes = {
	setErrorLoadPage: PropTypes.func,
};

export default MainConfirmMyBook;
