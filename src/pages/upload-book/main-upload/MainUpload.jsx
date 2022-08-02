import Dropzone from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { CameraIcon, BackArrow, Calendar } from 'components/svg';
import './MainUpload.scss';
import { useState, useRef, useEffect } from 'react';
import Input from 'shared/input';
import { Row, Col } from 'react-bootstrap';
import Button from 'shared/button';
import SelectBox from 'shared/select-box';
import ArrowChevronForward from 'assets/images/ArrowChevronForward.png';
import Datepicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { uploadImage } from 'reducers/redux-utils/common';
import ModalSeries from 'shared/modal-series/ModalSeries';

export default function MainUpload() {
	const [textareaValue, setTextareaValue] = useState('');
	const [releaseDate, setReleaseDate] = useState(null);
	const inpCalendar = useRef();
	const dispatch = useDispatch();

	const [imgUrl, setImgUrl] = useState('');
	const [inputNameGroup, setInputNameBook] = useState('');
	const [languages, setLanguages] = useState('');

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
		setLanguages(data);
	};

	const navigate = useNavigate();
	const handleClick = () => {
		navigate('/');
	};
	const onInputChange = f => e => f(e.target.value);

	const GoBack = () => {
		return (
			<div className='group-btn-back'>
				<button onClick={() => handleClick()}>
					<BackArrow />
				</button>{' '}
				<span>Thêm sách</span>
			</div>
		);
	};

	const updateTxtAreaValue = e => {
		setTextareaValue(e.target.value);
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
			<div className='upload-icon-goback'>{GoBack()}</div>
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
						<Input isBorder={false} placeholder='Tên sách' handleChange={onInputChange(setInputNameBook)} />
					</div>
					<div className='inp-book'>
						<label>Tiêu đề phụ</label>
						<Input
							isBorder={false}
							placeholder='Tiêu đề phụ'
							handleChange={onInputChange(setInputNameBook)}
						/>
					</div>
					<div className='inp-book'>
						<label>Tên sách gốc</label>
						<Input
							isBorder={false}
							placeholder='Tên sách gốc'
							handleChange={onInputChange(setInputNameBook)}
						/>
					</div>
					<div className='inp-book'>
						<label>
							Tác giả<span className='upload-text-danger'>*</span>
						</label>
						<Input isBorder={false} placeholder='Tác giả' handleChange={onInputChange(setInputNameBook)} />
					</div>
					<div className='inp-book'>
						<label>Dịch giả</label>
						<Input isBorder={false} placeholder='Dịch giả' handleChange={onInputChange(setInputNameBook)} />
					</div>
					<div className='inp-book'>
						<label>
							Chủ đề<span className='upload-text-danger'>*</span>
						</label>
						<Input isBorder={false} placeholder='Tên sách' handleChange={onInputChange(setInputNameBook)} />
					</div>
					<div className='inp-book'>
						<label>
							Nhà xuất bản<span className='upload-text-danger'>*</span>
						</label>
						<Input
							isBorder={false}
							placeholder='Nhà xuất bản'
							handleChange={onInputChange(setInputNameBook)}
						/>
					</div>
					<div className='inp-book'>
						<Row>
							<Col xs={6}>
								<label>
									ISBN<span className='upload-text-danger'>*</span>
								</label>
								<Input
									isBorder={false}
									placeholder='ISBN'
									handleChange={onInputChange(setInputNameBook)}
								/>
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
								<Input
									type='number'
									isBorder={false}
									placeholder='Số trang'
									handleChange={onInputChange(setInputNameBook)}
								/>
							</Col>
							<Col>
								<label>
									Ngôn ngữ<span className='upload-text-danger'>*</span>
								</label>
								<SelectBox
									name='languages'
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
							<textarea placeholder='' rows={9} value={textareaValue} onChange={updateTxtAreaValue} />
						</div>
					</div>
					<Row>
						<Col>
							<Button onClick={() => console.log('Xóa tất cả')} className='btn btnMainUpload' isOutline>
								Xóa tất cả
							</Button>
						</Col>
						<Col>
							<Button onClick={() => console.log('Lưu')} className='btn btnMainUpload'>
								Lưu
							</Button>
						</Col>
					</Row>
				</div>
				{/* </div> */}
			</div>
		</>
	);
}
