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
import { useDispatch } from 'react-redux';
import { uploadImage } from 'reducers/redux-utils/common';
import ModalSeries from 'shared/modal-series/ModalSeries';

export default function MainUpload() {
	const [releaseDate, setReleaseDate] = useState(null);
	const inpCalendar = useRef();
	const dispatch = useDispatch();

	const [imgUrl, setImgUrl] = useState(undefined);
	const [language, setLanguage] = useState('');

	const initialState = {
		title: '',
		subTitle: '',
		originalTitle: '',
		author: '',
		translator: '',
		theme: '',
		publisher: '',
		isbn: '',
		totalPages: '',
		description: '',
	};

	const [
		{ title, subTitle, originalTitle, author, translator, theme, publisher, isbn, totalPages, description },
		setState,
	] = useState(initialState);

	const onChange = e => {
		const { name, value } = e.target;
		setState(prevState => ({ ...prevState, [name]: value }));
	};

	const clearState = () => {
		setImgUrl('');
		setReleaseDate(null);
		setLanguage('');
		setState({ ...initialState });
	};

	const [showModalSeries, setShowModalSeries] = useState(false);
	const handleCloseModalSeries = () => setShowModalSeries(false);
	const handleShowModalSeries = () => setShowModalSeries(true);

	const APIListSeries = [
		{ id: '1', title: 'Ươm mầm tỉ phú nhí' },
		{ id: '2', title: 'Ươm mầm tỉ phú nhí' },
		{ id: '3', title: 'Ươm mầm tỉ phú nhí' },
	];

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

	const listLanguages = [
		{ value: 'VN', title: 'Việt Nam' },
		{ value: 'EN', title: 'Anh' },
	];

	const languagesRef = useRef({ value: 'default', title: 'Ngôn ngữ' });

	const onchangeLanguages = data => {
		setLanguage(data.value);
	};

	const onBtnSaveClick = () => {
		// B1: Thu thập dữ liệu
		const bookInfo = {
			imgUrl: imgUrl,
			title: title,
			subTitle: subTitle,
			originalTitle: originalTitle,
			author: author,
			translator: translator,
			theme: theme,
			publisher: publisher,
			isbn: isbn,
			releaseDate: releaseDate,
			totalPages: totalPages,
			language: language,
			series: '',
			description: description,
		};
		console.log(bookInfo);
		// B2: Kiểm tra dữ liệu
		// B3: Gọi api
		// B4: Xử lý hiển thị kết quả
	};

	useEffect(() => {
		uploadImageFile();
	}, [acceptedFiles]);

	const uploadImageFile = async () => {
		const imageUploadedData = await dispatch(uploadImage(acceptedFiles)).unwrap();
		setImgUrl(imageUploadedData?.streamPath);
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
					{imgUrl ? (
						<img style={{ width: '100%', maxHeight: '266px', objectFit: 'cover' }} src={imgUrl} alt='img' />
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
							value={title}
							name='title'
							onChange={onChange}
						></input>
					</div>
					<div className='inp-book'>
						<label>Tiêu đề phụ</label>
						<input
							className='input input--non-border'
							placeholder='Tiêu đề phụ'
							value={subTitle}
							name='subTitle'
							onChange={onChange}
						></input>
					</div>
					<div className='inp-book'>
						<label>Tên sách gốc</label>
						<input
							className='input input--non-border'
							placeholder='Tên sách gốc'
							value={originalTitle}
							name='originalTitle'
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
						<label>
							Chủ đề<span className='upload-text-danger'>*</span>
						</label>
						<input
							className='input input--non-border'
							placeholder='Chủ đề'
							value={theme}
							name='theme'
							onChange={onChange}
						></input>
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
										selected={releaseDate}
										onChange={date => setReleaseDate(date)}
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
									className='input input--non-border'
									placeholder='Số trang'
									value={totalPages}
									name='totalPages'
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
								/>
							</Col>
						</Row>
					</div>
					<div className='inp-book'>
						<label>Sê-ri</label>
						<input
							className='input input--non-border'
							onClick={handleShowModalSeries}
							placeholder='Sê-ri bộ sách'
						></input>
						<div className='modal-series'>
							<ModalSeries
								showModalSeries={showModalSeries}
								handleCloseModalSeries={handleCloseModalSeries}
								APIListSeries={APIListSeries}
							/>
						</div>
					</div>
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
