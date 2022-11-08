import { lazy, Suspense } from 'react';
import Dropzone from 'react-dropzone';
import { Link } from 'react-router-dom';
import { BackArrow, Calendar, Image, CloseX } from 'components/svg';
import './MainUpload.scss';
import { useState, useRef, useEffect } from 'react';
const Button = lazy(() => import('shared/button'));
const SelectBox = lazy(() => import('shared/select-box'));
import ArrowChevronForward from 'assets/images/ArrowChevronForward.png';
import Datepicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from 'reducers/redux-utils/common';
import { toast } from 'react-toastify';
import { createBook } from 'reducers/redux-utils/book';
import { addBookToSeries } from 'reducers/redux-utils/series';
import { NotificationError } from 'helpers/Error';
import classNames from 'classnames';
import _ from 'lodash';
import Circle from 'shared/loading/circle';
import { blockInvalidChar } from 'constants';
const ModalSeries = lazy(() => import('shared/modal-series/ModalSeries'));
const AddAndSearchAuthorUploadBook = lazy(() => import('./AddAndSearchAuthorUploadBook/AddAndSearchAuthorUploadBook'));
const AddAndSearchCategoriesUploadBook = lazy(() =>
	import('./AddAndSearchCategoriesUploadBook/AddAndSearchCategoriesUploadBook')
);
const AddAndSearchPublisherUploadBook = lazy(() =>
	import('./AddAndSearchPublisherUploadBook/AddAndSearchPublisherUploadBook')
);
// import AddAndSearchTranslatorsUploadBook from './AddAndSearchTranslatorsUploadBook/AddAndSearchTranslatorsUploadBook';

export default function MainUpload() {
	const [publishDate, setPublishDate] = useState(null);
	const dispatch = useDispatch();
	const { userInfoJwt } = useSelector(state => state.auth);

	const [image, setImage] = useState(null);
	const [categoryAddedList, setCategoryAddedList] = useState([]);
	const [authors, setAuthors] = useState([]);
	const [translators, setTranslators] = useState([]);
	const [publisher, setPublisher] = useState([]);
	const [language, setLanguage] = useState('');
	const [series, setSeries] = useState({});

	const [resetSelect, setResetSelect] = useState(false);
	const [buttonActive, setButtonActive] = useState(false);
	const [temporarySeries, setTemporarySeries] = useState({});

	const [inputAuthorValue, setInputAuthorValue] = useState('');
	// const [inputTranslatorValue, setInputTranslatorValue] = useState('');
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	const [inputPublisherValue, setInputPublisherValue] = useState('');

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
		setImage('');
		setPublishDate(null);
		setTemporarySeries({});
		setInputAuthorValue('');
		setAuthors([]);
		// setInputTranslatorValue('');
		setTranslators([]);
		setPublisher([]);
		setInputCategoryValue('');
		setCategoryAddedList([]);
		setSeries({});
		setLanguage('');
		setResetSelect(!resetSelect);
		setState(initialState);
	};

	const [showModalSeries, setShowModalSeries] = useState(false);
	const handleCloseModalSeries = () => setShowModalSeries(false);
	const handleShowModalSeries = () => setShowModalSeries(true);

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

				await handleAddBookToSeries(paramsForAddBookToSeries);
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

	const onBtnSaveClick = async () => {
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

		const imgSrc = await uploadImageFile(image);

		let dataDate = publishDate;
		if (publishDate) {
			const offset = dataDate.getTimezoneOffset();
			dataDate = new Date(dataDate.getTime() - offset * 60 * 1000).toISOString().split('T')[0];
		}

		const bookInfo = {
			frontBookCover: imgSrc,
			images: [imgSrc],
			name: name,
			subName: subName,
			originalName: originalName,
			authors:
				authorsArr.length > 0
					? authorsArr
					: [
							{
								isUser: false,
								authorName: inputAuthorValue,
							},
					  ],
			translators: translators,
			publisherId: publisher[0].id,
			isbn: isbn,
			publishDate: dataDate,
			page: Number(page),
			language: language,
			description: description,
			categoryIds: categoryIds,
			tags: [],
			series: series,
		};

		handleCreateBook(bookInfo);
	};

	const onClickCancelSeries = () => {
		setSeries({});
		setTemporarySeries({});
	};

	useEffect(() => {
		if (
			!image ||
			(image && image.length === 0) ||
			!name ||
			(authors.length === 0 && !inputAuthorValue) ||
			categoryAddedList.length === 0 ||
			publisher.length === 0 ||
			!isbn ||
			!page ||
			!language ||
			!description
		) {
			setButtonActive(false);
		} else {
			setButtonActive(true);
		}
	}, [image, name, authors, inputAuthorValue, categoryAddedList, publisher, isbn, page, language, description]);

	const uploadImageFile = async acceptedFiles => {
		try {
			const imageUploadedData = await dispatch(uploadImage(acceptedFiles)).unwrap();
			return imageUploadedData?.streamPath.small;
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		if (image && !image.length) {
			const toastId = 'main-upload-front-book-cover';
			toast.warning('Chỉ được chọn ảnh PNG, JPG, JPEG và không được quá 3MB', { toastId: toastId });
		}
	}, [image]);

	return (
		<Suspense fallback={<Circle />}>
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
				<Dropzone
					onDrop={acceptedFiles => setImage(acceptedFiles)}
					multiple={false}
					accept={['.png', '.jpeg', '.jpg']}
					maxSize={3000000}
				>
					{({ getRootProps, getInputProps }) => (
						<div {...getRootProps({ className: 'upload-image__wrapper' })}>
							{image && image.length > 0 ? (
								<img src={URL.createObjectURL(image[0])} alt='img' />
							) : (
								<>
									<input {...getInputProps()} />
									<div className='upload-image'>
										<div className='upload-image__wrapper__icon'>
											<Image />
										</div>
										<br />
										<p className='upload-image__description'>
											Thêm ảnh bìa từ thiết bị
											<span style={{ color: 'red' }}>*</span>
										</p>
										<span style={{ fontWeight: 500, marginTop: '5px' }}>(hoặc kéo thả)</span>
									</div>
								</>
							)}
						</div>
					)}
				</Dropzone>
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
							onChange={e => setTranslators([e.target.value])}
						></input>
					</div>
					<div className='inp-book'>
						<AddAndSearchCategoriesUploadBook
							inputCategoryValue={inputCategoryValue}
							setInputCategoryValue={setInputCategoryValue}
							categoryAddedList={categoryAddedList}
							setCategoryAddedList={setCategoryAddedList}
							maxAddedValue={5}
						/>
					</div>
					<div className='inp-book'>
						<AddAndSearchPublisherUploadBook
							inputPublisherValue={inputPublisherValue}
							setInputPublisherValue={setInputPublisherValue}
							publisher={publisher}
							setPublisher={setPublisher}
							maxAddedValue={1}
						/>
					</div>
					<div className='inp-book'>
						<div className='inp-book-row'>
							<div className='inp-book-col'>
								<label>
									ISBN<span className='upload-text-danger'>*</span>
								</label>
								<input
									className='input input--non-border'
									type='number'
									min='0'
									onWheel={e => e.target.blur()}
									onKeyDown={blockInvalidChar}
									placeholder='ISBN'
									value={isbn}
									name='isbn'
									onChange={onChange}
								></input>
							</div>
							<div className='inp-book-col'>
								<label>Ngày phát hành</label>
								<label style={{ marginBottom: '0px', display: 'inherit' }}>
									<div className='inp-date'>
										<div className='icon-calendar'>
											<Calendar />
										</div>
										<Datepicker
											isClearable
											placeholderText='dd/mm/yyyy'
											dateFormat='dd/MM/yyyy'
											selected={publishDate}
											onChange={date => setPublishDate(date)}
											showYearDropdown
											showMonthDropdown
											dropdownMode='select'
										/>
									</div>
								</label>
							</div>
						</div>
					</div>
					<div className='inp-book'>
						<div className='inp-book-row'>
							<div className='inp-book-col'>
								<label>
									Số trang<span className='upload-text-danger'>*</span>
								</label>
								<input
									type='number'
									min='0'
									onWheel={e => e.target.blur()}
									onKeyDown={blockInvalidChar}
									className='input input--non-border'
									placeholder='Số trang'
									value={page}
									name='page'
									onChange={onChange}
								></input>
							</div>
							<div className='inp-book-col'>
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
							</div>
						</div>
					</div>

					{(userInfoJwt?.role === 'tecinus' || userInfoJwt?.role === 'author') && (
						<div className='inp-book inp-series' style={{ position: 'relative' }}>
							<label>Sê-ri</label>
							<input
								className='input input--non-border'
								onClick={handleShowModalSeries}
								placeholder='Sê-ri bộ sách'
								value={series.name || ''}
								readOnly
							></input>
							{!_.isEmpty(series) && (
								<button className='btn-cancel-series' onClick={onClickCancelSeries}>
									<CloseX />
								</button>
							)}
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
					)}

					<div className='inp-book'>
						<label>
							Mô tả<span className='upload-text-danger'>*</span>
						</label>
						<div className='txtarea'>
							<textarea rows={9} value={description} name='description' onChange={onChange} />
						</div>
					</div>
					<div className='inp-book-row'>
						<div className='inp-book-col'>
							<Button onClick={clearState} className='btn btnMainUpload' isOutline>
								Xóa tất cả
							</Button>
						</div>
						<div className='inp-book-col'>
							<button
								onClick={onBtnSaveClick}
								className={classNames('creat-post-modal-content__main__submit', 'btn-upload', {
									'active': buttonActive,
								})}
								disabled={!buttonActive}
							>
								Lưu
							</button>
						</div>
					</div>
				</div>
			</div>
		</Suspense>
	);
}
