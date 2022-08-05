import Dropzone from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { CameraIcon, BackArrow, Calendar } from 'components/svg';
import './MainUpload.scss';
import { useState, useRef, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from 'shared/button';
import SelectBox from 'shared/select-box';
import ArrowChevronForward from 'assets/images/ArrowChevronForward.png';
import Datepicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from 'reducers/redux-utils/common';
import ModalSeries from 'shared/modal-series/ModalSeries';
import AddAndSearchCategoriesUploadBook from './AddAndSearchCategoriesUploadBook/AddAndSearchCategoriesUploadBook';
import { toast } from 'react-toastify';
import { createBook } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';

export default function MainUpload() {
	const [publishDate, setPublishDate] = useState(null);
	const inpCalendar = useRef();
	const dispatch = useDispatch();
	const { userInfoJwt } = useSelector(state => state.auth);

	const [image, setFrontBookCover] = useState('');
	const [categoryAddedList, setCategoryAddedList] = useState([]);
	const [language, setLanguage] = useState('');
	const [series, setSeries] = useState({});

	const [resetSelect, setResetSelect] = useState(false);

	const blockInvalidChar = e => {
		return ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
	};

	const initialState = {
		name: '',
		subName: '',
		originalName: '',
		author: '',
		translator: '',
		publisher: '',
		isbn: '',
		page: '',
		description: '',
	};

	const [{ name, subName, originalName, author, translator, publisher, isbn, page, description }, setState] =
		useState(initialState);

	const onChange = e => {
		const { name, value } = e.target;
		setState(prevState => ({ ...prevState, [name]: value }));
	};

	const languagesRef = useRef({ value: 'default', name: 'Ngôn ngữ' });

	const clearState = () => {
		setFrontBookCover('');
		setPublishDate(null);

		// reset ô select
		setLanguage('');
		setResetSelect(!resetSelect);

		setSeries({});

		setCategoryAddedList([]);

		setState({ ...initialState });
	};

	const [showModalSeries, setShowModalSeries] = useState(false);
	const handleCloseModalSeries = () => setShowModalSeries(false);
	const handleShowModalSeries = () => setShowModalSeries(true);

	const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone();

	const listLanguages = [
		{ value: 'vn', name: 'Việt Nam' },
		{ value: 'en', name: 'Anh' },
	];

	const onchangeLanguages = data => {
		setLanguage(data.value);
	};

	const toastWarning = () => {
		const customId = 'custom-id-upload';
		toast.warning('Vui lòng điền đầy đủ thông tin', { toastId: customId });
	};

	const validateInput = param => {
		if (!param.images) {
			toastWarning();
			return false;
		}
		if (!param.name) {
			toastWarning();
			return false;
		}
		if (!param.authors[0].authorName) {
			toastWarning();
			return false;
		}
		if (param.categoryIds.length === 0) {
			toastWarning();
			return false;
		}
		if (!param.publisher) {
			toastWarning();
			return false;
		}
		if (!param.isbn) {
			toastWarning();
			return false;
		}
		if (!param.page) {
			toastWarning();
			return false;
		}
		if (!param.language) {
			toastWarning();
			return false;
		}
		if (!param.description) {
			toastWarning();
			return false;
		}
		return true;
	};

	const handleCreateBook = async params => {
		try {
			const res = await dispatch(createBook(params)).unwrap();
			// B4: Xử lý hiển thị kết quả
			toast.success('Đăng tải sách thành công');
		} catch (err) {
			NotificationError(err);
		}
	};

	const onBtnSaveClick = () => {
		// B1: Thu thập dữ liệu

		// Lấy danh sách categoryIds
		const categoryIds = [];
		for (let i = 0; i < categoryAddedList.length; i++) {
			categoryIds.push(categoryAddedList[i].id);
		}

		const bookInfo = {
			frontBookCover: image,
			images: [image],
			name: name,
			subName: subName,
			originalName: originalName,
			authors: [
				{
					isUser: false,
					authorName: author,
				},
			],
			translator: translator,
			publisher: publisher,
			isbn: isbn,
			publishDate: publishDate,
			page: Number(page),
			language: language,
			description: description,
			categoryIds: categoryIds,
			tags: [],
		};

		// B2: Kiểm tra dữ liệu
		const validate = validateInput(bookInfo);

		if (validate) {
			// B3: Gọi api
			handleCreateBook(bookInfo);
		}
	};

	useEffect(() => {
		uploadImageFile();
	}, [acceptedFiles]);

	const uploadImageFile = async () => {
		const imageUploadedData = await dispatch(uploadImage(acceptedFiles)).unwrap();
		setFrontBookCover(imageUploadedData?.streamPath);
	};

	return (
		<>
			<div className='group-btn-back'>
				<Link to='/'>
					<button style={{ width: '48px', height: '48px' }}>
						<BackArrow />
					</button>
				</Link>
				<span style={{ fontWeight: '700', fontSize: '24px', lineHeight: '32px', letterSpacing: '1px' }}>
					Thêm sách
				</span>
			</div>
			<div className='upload-book-form'>
				<div className='upload-image__wrapper'>
					{image ? (
						<img
							src={image}
							alt='img'
							onClick={open}
							onMouseEnter={e => (e.target.style.cursor = 'pointer')}
						/>
					) : (
						<Dropzone>
							{() => (
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									<div className='dropzone upload-image'>
										<CameraIcon />
										<Image className='upload-image__icon' />
										<p className='upload-image__description'>Thêm ảnh bìa từ thiết bị</p>
										<br />
										<span style={{ fontWeight: 500 }}>hoặc kéo thả</span>
									</div>
								</div>
							)}
						</Dropzone>
					)}
				</div>
				<div className='upload-info-form'>
					<div className='inp-book'>
						<label>
							Tên sách<span className='upload-text-danger'>*</span>
						</label>
						<input
							className='input input--non-border'
							placeholder='Tên sách'
							value={name}
							name='name'
							onChange={onChange}
						></input>
					</div>
					<div className='inp-book'>
						<label>Tiêu đề phụ</label>
						<input
							className='input input--non-border'
							placeholder='Tiêu đề phụ'
							value={subName}
							name='subName'
							onChange={onChange}
						></input>
					</div>
					<div className='inp-book'>
						<label>Tên sách gốc</label>
						<input
							className='input input--non-border'
							placeholder='Tên sách gốc'
							value={originalName}
							name='originalName'
							onChange={onChange}
						></input>
					</div>
					<div className='inp-book'>
						<label>
							Tác giả<span className='upload-text-danger'>*</span>
						</label>
						<input
							className='input input--non-border'
							placeholder='Tác giả'
							value={author}
							name='author'
							onChange={onChange}
						></input>
					</div>
					<div className='inp-book'>
						<label>Dịch giả</label>
						<input
							className='input input--non-border'
							placeholder='Dịch giả'
							value={translator}
							name='translator'
							onChange={onChange}
						></input>
					</div>
					<div className='inp-book'>
						<AddAndSearchCategoriesUploadBook
							categoryAddedList={categoryAddedList}
							setCategoryAddedList={setCategoryAddedList}
						/>
					</div>
					<div className='inp-book'>
						<label>
							Nhà xuất bản<span className='upload-text-danger'>*</span>
						</label>
						<input
							className='input input--non-border'
							placeholder='Nhà xuất bản'
							value={publisher}
							name='publisher'
							onChange={onChange}
						></input>
					</div>
					<div className='inp-book'>
						<Row>
							<Col xs={6}>
								<label>
									ISBN<span className='upload-text-danger'>*</span>
								</label>
								<input
									className='input input--non-border'
									placeholder='ISBN'
									value={isbn}
									name='isbn'
									onChange={onChange}
								></input>
							</Col>
							<Col xs={6}>
								<label>Ngày phát hành</label>
								<label className='inp-date'>
									<div className='icon-calendar'>
										<Calendar />
									</div>
									<Datepicker
										ref={inpCalendar}
										isClearable
										placeholderText='dd/m/yyyy'
										dateFormat='dd/M/yyyy'
										selected={publishDate}
										onChange={date => setPublishDate(date)}
										showYearDropdown
										showMonthDropdown
										dropdownMode='select'
									/>
								</label>
							</Col>
						</Row>
					</div>
					<div className='inp-book'>
						<Row>
							<Col>
								<label>
									Số trang<span className='upload-text-danger'>*</span>
								</label>
								<input
									type='number'
									onWheel={e => e.target.blur()}
									onKeyDown={blockInvalidChar}
									className='input input--non-border'
									placeholder='Số trang'
									value={page}
									name='page'
									onChange={onChange}
								></input>
							</Col>
							<Col>
								<label>
									Ngôn ngữ<span className='upload-text-danger'>*</span>
								</label>
								<SelectBox
									name='language'
									list={listLanguages}
									defaultOption={languagesRef.current}
									onChangeOption={onchangeLanguages}
									imgDropDown={ArrowChevronForward}
									resetSelect={resetSelect}
								/>
							</Col>
						</Row>
					</div>
					{userInfoJwt?.role === ('tecinus' || 'author') ? (
						<div className='inp-book'>
							<label>Sê-ri</label>
							<input
								className='input input--non-border'
								onClick={handleShowModalSeries}
								placeholder='Sê-ri bộ sách'
								value={series.name || ''}
								readOnly
							></input>
							<div className='modal-series'>
								<ModalSeries
									showModalSeries={showModalSeries}
									handleCloseModalSeries={handleCloseModalSeries}
									series={series}
									setSeries={setSeries}
								/>
							</div>
						</div>
					) : null}

					<div className='inp-book'>
						<label>
							Mô tả<span className='upload-text-danger'>*</span>
						</label>
						<div className='txtarea'>
							<textarea rows={9} value={description} name='description' onChange={onChange} />
						</div>
					</div>
					<Row>
						<Col>
							<Button onClick={clearState} className='btn btnMainUpload' isOutline>
								Xóa tất cả
							</Button>
						</Col>
						<Col>
							<Button onClick={onBtnSaveClick} className='btn btnMainUpload'>
								Lưu
							</Button>
						</Col>
					</Row>
				</div>
			</div>
		</>
	);
}
