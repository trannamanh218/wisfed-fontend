import { CloseIconX, Image } from 'components/svg';
import { useEffect, useRef, useState, useCallback } from 'react';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import './create-group.scss';
import { getCreatGroup } from 'reducers/redux-utils/group';
import Dropzone from 'react-dropzone';
import { uploadImage } from 'reducers/redux-utils/common';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { toast } from 'react-toastify';
import AddAndSearchItems from 'shared/add-and-search-items';
import { handleResetGroupList } from 'reducers/redux-utils/group';
import { getFilterSearch } from 'reducers/redux-utils/search';
import InputHashtag from 'shared/input/inputHashtag/inputHashtag';

const PopupCreateGroup = ({ handleClose, handleRefreshData = () => {} }) => {
	const groupNameInput = useRef('');
	const [inputNameGroup, setInputNameGroup] = useState('');
	const [inputDiscription, setInputDiscription] = useState('');
	const [listHashtags, setListHashtags] = useState([]);
	const [image, setImage] = useState(null);
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [kindOfGroup, setKindOfGroup] = useState({});
	const [lastTag, setLastTag] = useState('');
	const [listAuthors, setListAuthors] = useState([]);
	const [inputAuthorValue, setInputAuthorValue] = useState('');
	const [authorAddedList, setAuthorAddedList] = useState([]);
	const [authorSearchedList, setAuthorSearchedList] = useState([]);
	const [hasMoreAuthorsEllipsis, setHasMoreAuthorsEllipsis] = useState(false);
	const [categoryIdBook, setCategoryIdBook] = useState([]);
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	const [categoryAddedList, setCategoryAddedList] = useState([]);
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [listBookAdd, setListBookAdd] = useState([]);
	const [inputBookValue, setInputBookValue] = useState('');
	const [bookAddedList, setBookAddedList] = useState([]);
	const [bookSearchedList, setBookSearchedList] = useState([]);
	const [hasMoreBooksEllipsis, setHasMoreBooksEllipsis] = useState(false);
	const [getDataFinishCategories, setGetDataFinishCategories] = useState(false);
	const [getDataFinishAuthors, setGetDataFinishAuthors] = useState(false);
	const [getDataFinishBooks, setGetDataFinishBooks] = useState(false);
	const [showError, setShowError] = useState(false);

	const authorInputContainer = useRef(null);
	const authorInputWrapper = useRef(null);
	const authorInput = useRef(null);

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const bookInputContainer = useRef(null);
	const bookInputWrapper = useRef(null);
	const bookInput = useRef(null);

	const dispatch = useDispatch();

	const getSuggestionAuthors = async input => {
		try {
			const params = {
				q: input,
				type: 'authors',
				start: 0,
				limit: 10,
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			setAuthorSearchedList(result.rows);
			if (result.count > result.rows.length) {
				setHasMoreAuthorsEllipsis(true);
			} else {
				setHasMoreAuthorsEllipsis(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinishAuthors(true);
		}
	};

	const getSuggestionCategories = async input => {
		try {
			const params = {
				q: input,
				type: 'categories',
				start: 0,
				limit: 10,
				must_not: { 'numberBook': '0' },
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			setCategorySearchedList(result.rows);
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinishCategories(true);
		}
	};

	const getSuggestionBooks = async input => {
		try {
			const params = {
				q: input,
				type: 'books',
				start: 0,
				limit: 10,
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			setBookSearchedList(result.rows);
			if (result.count > result.rows.length) {
				setHasMoreBooksEllipsis(true);
			} else {
				setHasMoreBooksEllipsis(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinishBooks(true);
		}
	};

	const debounceSearchAuthors = useCallback(
		_.debounce(inputValue => getSuggestionAuthors(inputValue), 700),
		[]
	);

	const debounceSearchCategories = useCallback(
		_.debounce(inputValue => getSuggestionCategories(inputValue), 700),
		[]
	);

	const debounceSearchBooks = useCallback(
		_.debounce(inputValue => getSuggestionBooks(inputValue), 700),
		[]
	);

	const addAuthor = author => {
		if (authorAddedList.filter(authorAdded => authorAdded.id === author.id).length > 0) {
			removeAuthor(author.id);
		} else {
			if (kindOfGroup.value === 'author' && authorAddedList.length >= 5) {
				toast.warning('Chỉ được chọn tối đa 5 tác giả');
			} else {
				const authorArrayTemp = [...authorAddedList];
				authorArrayTemp.push(author);
				setAuthorAddedList(authorArrayTemp);
				setInputAuthorValue('');
				setAuthorSearchedList([]);
				if (authorInputWrapper.current) {
					authorInputWrapper.current.style.width = '0.5ch';
				}
			}
		}
	};

	const addCategory = category => {
		if (categoryAddedList.filter(categoryAdded => categoryAdded.id === category.id).length > 0) {
			removeCategory(category.id);
		} else {
			const categoryArrayTemp = [...categoryAddedList];
			categoryArrayTemp.push(category);
			setCategoryAddedList(categoryArrayTemp);
			setInputCategoryValue('');
			setCategorySearchedList([]);
			if (categoryInputWrapper.current) {
				categoryInputWrapper.current.style.width = '0.5ch';
			}
		}
	};

	const addBook = book => {
		if (bookAddedList.filter(bookAdded => bookAdded.id === book.id).length > 0) {
			removeBook(book.id);
		} else {
			const bookArrayTemp = [...bookAddedList];
			bookArrayTemp.push(book);
			setBookAddedList(bookArrayTemp);
			setInputBookValue('');
			setBookSearchedList([]);
			if (bookInputWrapper.current) {
				bookInputWrapper.current.style.width = '0.5ch';
			}
		}
	};

	const removeAuthor = authorId => {
		const authorArr = [...authorAddedList];
		const index = authorArr.findIndex(item => item.id === authorId);
		authorArr.splice(index, 1);
		setAuthorAddedList(authorArr);
	};

	const removeCategory = categoryId => {
		const categoryArr = [...categoryAddedList];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setCategoryAddedList(categoryArr);
	};

	const removeBook = bookId => {
		const bookArr = [...bookAddedList];
		const index = bookArr.findIndex(item => item.id === bookId);
		bookArr.splice(index, 1);
		setBookAddedList(bookArr);
	};

	const searchAuthor = e => {
		setGetDataFinishAuthors(false);
		setAuthorSearchedList([]);
		setInputAuthorValue(e.target.value);
		if (e.target.value) {
			debounceSearchAuthors(e.target.value);
		}
		if (authorInputWrapper.current) {
			authorInputWrapper.current.style.width = authorInput.current.value.length + 0.5 + 'ch';
		}
	};

	const searchCategory = e => {
		setGetDataFinishCategories(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		if (e.target.value) {
			debounceSearchCategories(e.target.value);
		}
		if (categoryInputWrapper.current) {
			categoryInputWrapper.current.style.width = categoryInput.current.value.length + 0.5 + 'ch';
		}
	};

	const searchBook = e => {
		setGetDataFinishBooks(false);
		setBookSearchedList([]);
		setInputBookValue(e.target.value);
		if (e.target.value) {
			debounceSearchBooks(e.target.value);
		}
		if (bookInputWrapper.current) {
			bookInputWrapper.current.style.width = bookInput.current.value.length + 0.5 + 'ch';
		}
	};

	useEffect(() => {
		const authorIdArr = [];
		for (let i = 0; i < authorAddedList.length; i++) {
			authorIdArr.push(authorAddedList[i].id);
		}
		setListAuthors(authorIdArr);
	}, [authorAddedList]);

	useEffect(() => {
		const categoryIdArr = [];
		for (let i = 0; i < categoryAddedList.length; i++) {
			categoryIdArr.push(categoryAddedList[i].id);
		}
		setCategoryIdBook(categoryIdArr);
	}, [categoryAddedList]);

	useEffect(() => {
		const bookIdArr = [];
		for (let i = 0; i < bookAddedList.length; i++) {
			bookIdArr.push(bookAddedList[i].id);
		}
		setListBookAdd(bookIdArr);
	}, [bookAddedList]);

	const uploadImageFile = async acceptedFiles => {
		const imageUploadedData = await dispatch(uploadImage(acceptedFiles)).unwrap();
		return imageUploadedData?.streamPath.default;
	};

	const onInputChange = f => e => {
		const value = e.target.value.trim();
		f(value);
	};

	useEffect(() => {
		if (image && !!image.length && inputDiscription !== '' && inputNameGroup !== '' && !showError) {
			switch (kindOfGroup.value) {
				case 'book':
					if (listBookAdd.length > 0 && categoryIdBook.length > 0) {
						setIsShowBtn(true);
					} else {
						setIsShowBtn(false);
					}
					break;
				case 'author':
					if (listAuthors.length > 0) {
						setIsShowBtn(true);
					} else {
						setIsShowBtn(false);
					}
					break;
				default: // case 'category'
					if (categoryIdBook.length > 0) {
						setIsShowBtn(true);
					} else {
						setIsShowBtn(false);
					}
			}
		} else {
			setIsShowBtn(false);
		}
	}, [image, listAuthors, kindOfGroup, inputDiscription, inputNameGroup, listBookAdd, categoryIdBook, showError]);

	const createGroup = async () => {
		if (isShowBtn) {
			const newListHastag = listHashtags.map(item => `${item}`);
			let newList;
			if (lastTag.includes('#') && lastTag !== '#') {
				newList = [...newListHastag, lastTag];
			} else {
				newList = newListHastag;
			}

			const imgSrc = await uploadImageFile(image);

			const data = {
				name: inputNameGroup,
				description: inputDiscription,
				avatar: imgSrc,
				groupType: kindOfGroup.value,
				authorIds: listAuthors,
				tags: newList,
				categoryIds: categoryIdBook,
				bookIds: listBookAdd,
			};

			try {
				await dispatch(getCreatGroup(data)).unwrap();
				const customId = 'custom-id-PopupCreateGroup';
				toast.success('Tạo nhóm thành công', { toastId: customId });
				dispatch(handleResetGroupList());
				// Tải lại dữ liệu hiển thị Nhóm do bạn quản lý
				handleRefreshData();
			} catch (err) {
				NotificationError(err);
			} finally {
				handleClose();
			}
		}
	};

	const listKindOfGroup = [
		{ value: 'book', title: 'Sách' },
		{ value: 'author', title: 'Tác giả' },
		{ value: 'category', title: 'Chia sẻ' },
	];

	const listIdBook = [
		{ value: 27, title: 'Yêu đọc sách' },
		{ value: 30, title: 'Thử thách đọc sách' },
	];

	const kindOfGroupRef = useRef({ value: 'default', title: 'Tác giả/ Chia sẻ/ Sách' });
	const categoryBookRef = useRef({ value: 'default', title: 'Chọn chủ đề' });
	const textArea = useRef(null);

	const onchangeKindOfGroup = data => {
		setKindOfGroup(data);

		// Xóa dữ liệu ở các ô input khác mỗi lần thay đổi kiểu nội dung
		setInputAuthorValue('');
		setAuthorAddedList([]);

		setInputBookValue('');
		setBookAddedList([]);

		setInputCategoryValue('');
		setCategoryAddedList([]);
	};

	const onchangeBookCategory = data => {
		setCategoryIdBook([data.value]);
	};

	useEffect(() => {
		setKindOfGroup(kindOfGroupRef.current);
	}, [kindOfGroupRef.current]);

	useEffect(() => {
		groupNameInput.current.focus();
	}, []);

	useEffect(() => {
		if (image && !image.length) {
			const toastId = 'create-group-image';
			toast.warning('Chỉ được chọn ảnh PNG, JPG, JPEG và không được quá 3MB', { toastId: toastId });
		}
	}, [image]);

	return (
		<>
			<div className='popup-group__header'>
				<h3>Tạo nhóm</h3>
				<button onClick={handleClose}>
					<CloseIconX />
				</button>
			</div>

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
								<div className='dropzone upload-image'>
									<div className='upload-image__wrapper__icon'>
										<Image />
									</div>
									<br />
									<span className='upload-image__description'>Thêm ảnh bìa từ thiết bị</span>
									hoặc kéo thả
									<div style={{ color: 'red', paddingTop: '5px' }}>(bắt buộc)</div>
								</div>
							</>
						)}
					</div>
				)}
			</Dropzone>

			<div className='form-field-wrapper'>
				<div className='form-field-name'>
					<label>Tên nhóm</label>
					<span className='form-field-authors__asterisk'>*</span>
					<Input
						inputRef={groupNameInput}
						isBorder={false}
						placeholder='Tên nhóm'
						handleChange={onInputChange(setInputNameGroup)}
					/>
				</div>

				<div className='form-field-select__kind-of-group'>
					<label>Kiểu nội dung</label>
					<span className='form-field-authors__asterisk'>*</span>
					<SelectBox
						name='kindofgroup'
						list={listKindOfGroup}
						defaultOption={kindOfGroupRef.current}
						onChangeOption={onchangeKindOfGroup}
					/>
				</div>

				{kindOfGroup.value !== 'default' && (
					<>
						{kindOfGroup.value === 'book' && (
							<div className='form-field-select__kind-of-group'>
								<label>Chủ đề sách</label>
								<span className='form-field-authors__asterisk'>*</span>
								<SelectBox
									name='categoryBook'
									list={listIdBook}
									defaultOption={categoryBookRef.current}
									onChangeOption={onchangeBookCategory}
								/>
							</div>
						)}

						{kindOfGroup.value !== 'book' && (
							<div className='form-field-select__kind-of-group'>
								<label>Chủ đề </label>
								{kindOfGroup.value === 'author' ? (
									''
								) : (
									<span className='form-field-authors__asterisk'>*</span>
								)}
								<AddAndSearchItems
									categoryAddedList={categoryAddedList}
									categorySearchedList={categorySearchedList}
									addCategory={addCategory}
									removeCategory={removeCategory}
									getDataFinish={getDataFinishCategories}
									searchCategory={searchCategory}
									inputCategoryValue={inputCategoryValue}
									categoryInputContainer={categoryInputContainer}
									categoryInputWrapper={categoryInputWrapper}
									categoryInput={categoryInput}
									hasSearchIcon={true}
								/>
							</div>
						)}

						<div className='form-field-authors'>
							<label>Tên tác giả</label>
							{kindOfGroup.value === 'category' ? (
								''
							) : (
								<span className='form-field-authors__asterisk'>*</span>
							)}
							<AddAndSearchItems
								categoryAddedList={authorAddedList}
								categorySearchedList={authorSearchedList}
								addCategory={addAuthor}
								removeCategory={removeAuthor}
								getDataFinish={getDataFinishAuthors}
								searchCategory={searchAuthor}
								inputCategoryValue={inputAuthorValue}
								categoryInputContainer={authorInputContainer}
								categoryInputWrapper={authorInputWrapper}
								categoryInput={authorInput}
								hasMoreEllipsis={hasMoreAuthorsEllipsis}
								placeholder={'Tìm kiếm và thêm tác giả'}
							/>
						</div>

						<div className='form-field-authors'>
							<label>Tên sách</label>
							{kindOfGroup.value === 'category' || kindOfGroup.value === 'author' ? (
								''
							) : (
								<span className='form-field-authors__asterisk'>*</span>
							)}
							<AddAndSearchItems
								categoryAddedList={bookAddedList}
								categorySearchedList={bookSearchedList}
								addCategory={addBook}
								removeCategory={removeBook}
								getDataFinish={getDataFinishBooks}
								searchCategory={searchBook}
								inputCategoryValue={inputBookValue}
								categoryInputContainer={bookInputContainer}
								categoryInputWrapper={bookInputWrapper}
								categoryInput={bookInput}
								hasMoreEllipsis={hasMoreBooksEllipsis}
								placeholder={'Tìm kiếm và thêm sách'}
							/>
						</div>
					</>
				)}

				<div className='form-field-discription'>
					<label>Giới thiệu</label>
					<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
					<textarea
						ref={textArea}
						className='form-field-textarea'
						rows={10}
						onChange={onInputChange(setInputDiscription)}
					/>
				</div>

				<InputHashtag
					listHashtags={listHashtags}
					setListHashtags={setListHashtags}
					setLastTag={setLastTag}
					showError={showError}
					setShowError={setShowError}
				/>

				<div className={`popup-create-group form-button ${!isShowBtn && 'disabled-btn'}`} onClick={createGroup}>
					<button>Tạo nhóm</button>
				</div>
			</div>
		</>
	);
};

PopupCreateGroup.propTypes = {
	handleClose: PropTypes.func,
	showRef: PropTypes.object,
	handleRefreshData: PropTypes.func,
};

export default PopupCreateGroup;
