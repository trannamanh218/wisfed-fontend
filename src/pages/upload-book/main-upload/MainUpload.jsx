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

export default function MainUpload() {
	const [textareaValue, setTextareaValue] = useState('');
	const [releaseDate, setReleaseDate] = useState(new Date());
	const inpCalendar = useRef();
	const dispatch = useDispatch();

	const [imgUrl, setImgUrl] = useState('');
	const [inputNameGroup, setInputNameBook] = useState('');
	const [languages, setLanguages] = useState('');

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

	const listLanguages = [
		{ value: 'default', title: 'Ngôn ngữ' },
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
			<div>{GoBack()}</div>
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
										<p className='upload-image__description'>Thêm ảnh từ thiết bị</p>
										<span>hoặc kéo thả</span>
									</div>
								</div>
							)}
						</Dropzone>
					)}
				</div>

				<div className='inp-book'>
					<label>Tên sách</label>
					<Input isBorder={false} placeholder='Tên sách' handleChange={onInputChange(setInputNameBook)} />
				</div>
				<div className='inp-book'>
					<label>Tiêu đề phụ</label>
					<Input isBorder={false} placeholder='Tiêu đề phụ' handleChange={onInputChange(setInputNameBook)} />
				</div>
				<div className='inp-book'>
					<label>Tên sách gốc</label>
					<Input isBorder={false} placeholder='Tiêu đề phụ' handleChange={onInputChange(setInputNameBook)} />
				</div>
				<div className='inp-book'>
					<label>Tác giả</label>
					<Input isBorder={false} placeholder='Tác giả' handleChange={onInputChange(setInputNameBook)} />
				</div>
				<div className='inp-book'>
					<label>Dịch giả</label>
					<Input isBorder={false} placeholder='Dịch giả' handleChange={onInputChange(setInputNameBook)} />
				</div>
				<div className='inp-book'>
					<label>Nhà xuất bản</label>
					<Input isBorder={false} placeholder='Nhà xuất bản' handleChange={onInputChange(setInputNameBook)} />
				</div>
				<div className='inp-book'>
					<Row>
						<Col xs={6}>
							<label>ISBN</label>
							<Input isBorder={false} placeholder='ISBN' handleChange={onInputChange(setInputNameBook)} />
						</Col>
						<Col xs={6}>
							<label>Sê-ri sách</label>
							<Input
								isBorder={false}
								placeholder='Sê-ri sách'
								handleChange={onInputChange(setInputNameBook)}
							/>
						</Col>
					</Row>
				</div>
				<div className='inp-book'>
					<Row>
						<Col>
							<label>Số trang</label>
							<Input
								type='number'
								isBorder={false}
								placeholder='Số trang'
								handleChange={onInputChange(setInputNameBook)}
							/>
						</Col>
						<Col>
							<label>Ngôn ngữ</label>
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
					<label>Ngày phát hành</label>
					<label className='inp-date'>
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
						<div className='icon-calendar'>
							<Calendar />
						</div>
					</label>
				</div>
				<div className='inp-book'>
					<label>Mô tả</label>
					<div className='txtarea'>
						<textarea placeholder='' rows={9} value={textareaValue} onChange={updateTxtAreaValue} />
					</div>
				</div>
				<div className='inp-book'>
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
			</div>
		</>
	);
}
