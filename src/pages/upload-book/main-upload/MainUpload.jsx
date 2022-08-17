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
import { toast } from 'react-toastify';
import { createBook } from 'reducers/redux-utils/book';
import { addBookToSeries } from 'reducers/redux-utils/series';
import { NotificationError } from 'helpers/Error';
import classNames from 'classnames';
import _ from 'lodash';
import AddAndSearchAuthorUploadBook from './AddAndSearchAuthorUploadBook/AddAndSearchAuthorUploadBook';
import AddAndSearchCategoriesUploadBook from './AddAndSearchCategoriesUploadBook/AddAndSearchCategoriesUploadBook';
// import AddAndSearchPublisherUploadBook from './AddAndSearchPublisherUploadBook/AddAndSearchPublisherUploadBook';
// import AddAndSearchTranslatorsUploadBook from './AddAndSearchTranslatorsUploadBook/AddAndSearchTranslatorsUploadBook';

export default function MainUpload() {
	const [publishDate, setPublishDate] = useState(null);
	const inpCalendar = useRef();
	const dispatch = useDispatch();
	const { userInfoJwt } = useSelector(state => state.auth);

	const [image, setFrontBookCover] = useState('');
	const [categoryAddedList, setCategoryAddedList] = useState([]);
	const [authors, setAuthors] = useState([]);
	// const [translators, setTranslators] = useState([]);
	const [translators, setTranslators] = useState('');
	// const [publisher, setPublisher] = useState([]);
	const [publisher, setPublisher] = useState('');
	const [language, setLanguage] = useState('');
	const [series, setSeries] = useState({});

	const [resetSelect, setResetSelect] = useState(false);
	const [buttonActive, setButtonActive] = useState(true);
	const [temporarySeries, setTemporarySeries] = useState({});

	const [inputAuthorValue, setInputAuthorValue] = useState('');
	const [inputTranslatorValue, setInputTranslatorValue] = useState('');
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	// const [inputPublisherValue, setInputPublisherValue] = useState('');

	const blockInvalidChar = e => {
		return ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
	};

	const initialState = {
		name: '',
		subName: '',
		originalName: '',
		isbn: '',
		page: '',
		description: '',
	};

	const [{ name, subName, originalName, isbn, page, description }, setState] = useState(initialState);

	const onChange = e => {
		const { name, value } = e.target;
		setState(prevState => ({ ...prevState, [name]: value }));
	};

	const languagesRef = useRef({ value: 'default', name: 'Ngôn ngữ' });

	const clearState = () => {
		setFrontBookCover('');
		setPublishDate(null);
		setTemporarySeries({});
		setInputAuthorValue('');
		setAuthors([]);
		setInputTranslatorValue('');
		// setTranslators([]);
		setTranslators('');
		// setInputPublisherValue('');
		// setPublisher([]);
		setPublisher('');

		setInputCategoryValue('');
		setCategoryAddedList([]);
		setSeries({});
		setLanguage('');
		setResetSelect(!resetSelect);
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

	const handleCreateBook = async params => {
		try {
			// Tạo sách mới
			const res = await dispatch(createBook(params)).unwrap();

			// Nếu sách có trường series thì cập nhật series đó
			if (!_.isEmpty(series)) {
				// Lấy id của sách vừa được tạo
				const bookCreatedId = res.id;

				const paramsForAddBookToSeries = {
					seriesId: series.id,
					body: { bookIds: [Number(bookCreatedId)] },
				};

				handleAddBookToSeries(paramsForAddBookToSeries);
			}

			// Xử lý hiển thị kết quả
			toast.success('Đang chờ xét duyệt sách. Chúng tôi sẽ thông báo cho bạn sau.');
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddBookToSeries = async params => {
		try {
			await dispatch(addBookToSeries(params)).unwrap();
		} catch (err) {
			NotificationError(err);
		}
	};

	const onBtnSaveClick = () => {
		// Lấy danh sách categoryIds
		const categoryIds = [];
		for (let i = 0; i < categoryAddedList.length; i++) {
			categoryIds.push(categoryAddedList[i].id);
		}

		// Tạo danh sách tác giả
		const authorsArr = [];
		for (let i = 0; i < authors.length; i++) {
			authorsArr.push({
				'isUser': true,
				'authorId': authors[i].id,
				'authorName': authors[i].name,
			});
		}

		const bookInfo = {
			frontBookCover: image,
			images: [image],
			name: name,
			subName: subName,
			originalName: originalName,
			authors: authorsArr,
			translators: translators,
			// publisher: publisher[0],
			publisher: publisher,
			isbn: isbn,
			publishDate: publishDate,
			page: Number(page),
			language: language,
			description: description,
			categoryIds: categoryIds,
			tags: [],
			series: series,
		};
		if (buttonActive) {
			handleCreateBook(bookInfo);
		}
	};

	useEffect(() => {
		uploadImageFile();
	}, [acceptedFiles]);

	useEffect(() => {
		if (
			!image ||
			!name ||
			authors.length === 0 ||
			categoryAddedList.length === 0 ||
			!publisher ||
			!isbn ||
			!page ||
			!language ||
			!description
		) {
			setButtonActive(true);
		} else {
			setButtonActive(true);
		}
	}, [image, name, authors, categoryAddedList, publisher, isbn, page, language, description]);

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
										<span style={{ fontWeight: 500, marginTop: '5px' }}>hoặc kéo thả</span>
										<span style={{ fontWeight: 500, color: 'red', marginTop: '10px' }}>
											(Bắt buộc*)
										</span>
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
						<AddAndSearchAuthorUploadBook
							inputAuthorValue={inputAuthorValue}
							setInputAuthorValue={setInputAuthorValue}
							authors={authors}
							setAuthors={setAuthors}
						/>
					</div>
					<div className='inp-book'>
						{/* <AddAndSearchTranslatorsUploadBook
							inputTranslatorValue={inputTranslatorValue}
							setInputTranslatorValue={setInputTranslatorValue}
							translators={translators}
							setTranslators={setTranslators}
						/> */}
						<label>Dịch giả</label>
						<input
							className='input input--non-border'
							placeholder='Dịch giả'
							value={translators}
							onChange={e => setTranslators(e.target.value)}
						></input>
					</div>
					<div className='inp-book'>
						<AddAndSearchCategoriesUploadBook
							inputCategoryValue={inputCategoryValue}
							setInputCategoryValue={setInputCategoryValue}
							categoryAddedList={categoryAddedList}
							setCategoryAddedList={setCategoryAddedList}
						/>
					</div>
					<div className='inp-book'>
						{/* <AddAndSearchPublisherUploadBook
							inputPublisherValue={inputPublisherValue}
							setInputPublisherValue={setInputPublisherValue}
							publisher={publisher}
							setPublisher={setPublisher}
						/> */}
						<label>Nhà xuất bản</label>
						<input
							className='input input--non-border'
							placeholder='Nhà xuất bản'
							value={publisher}
							onChange={e => setPublisher(e.target.value)}
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
										placeholderText='dd/mm/yyyy'
										dateFormat='dd/MM/yyyy'
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
					{userInfoJwt?.role === 'tecinus' || userInfoJwt?.role === 'author' ? (
						<div className='inp-book'>
							<label>Sê-ri</label>
							<input
								className='input input--non-border'
								onClick={handleShowModalSeries}
								placeholder='Sê-ri bộ sách'
								value={series.name || ''}
								readOnly
							></input>
							<div className='upload-modal-series'>
								<ModalSeries
									showModalSeries={showModalSeries}
									handleCloseModalSeries={handleCloseModalSeries}
									series={series}
									setSeries={setSeries}
									temporarySeries={temporarySeries}
									setTemporarySeries={setTemporarySeries}
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
							<button
								onClick={onBtnSaveClick}
								className={classNames('creat-post-modal-content__main__submit', 'btn-upload', {
									'active': buttonActive,
								})}
							>
								Lưu
							</button>
						</Col>
					</Row>
				</div>
			</div>
		</>
	);
}
