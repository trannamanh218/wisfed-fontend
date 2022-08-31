import { CameraIcon, CloseIconX } from 'components/svg';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Image } from 'react-bootstrap';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import './create-group.scss';
import { getRandomAuthor } from 'reducers/redux-utils/user';
import { getBookList } from 'reducers/redux-utils/book';
import { getCreatGroup } from 'reducers/redux-utils/group';
import Dropzone from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from 'reducers/redux-utils/common';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { toast } from 'react-toastify';
import AddAndSearchCategories from 'shared/add-and-search-categories';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';
import { handleResetGroupList } from 'reducers/redux-utils/group';

const PopupCreateGroup = ({ handleClose }) => {
	const groupNameInput = useRef('');
	const [inputNameGroup, setInputNameGroup] = useState('');
	const [inputDiscription, setInputDiscription] = useState('');
	const [inputAuthors, setInputAuthors] = useState('');
	const [inputBook, setInputBook] = useState('');
	const [userlist, setUserList] = useState([]);
	const [listBooks, setListBooks] = useState([]);
	const [listAuthors, setListAuthors] = useState([]);
	const [listBookAdd, setListBookAdd] = useState([]);
	const [inputHashtag, setInputHashtag] = useState('');
	const [listHashtags, setListHashtags] = useState([]);
	const [imgUrl, setImgUrl] = useState('');
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [kindOfGroup, setKindOfGroup] = useState('');
	const [categoryIdBook, setCategoryIdBook] = useState([]);
	const [lastTag, setLastTag] = useState('');
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	const [categoryAddedList, setCategoryAddedList] = useState([]);
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [getDataFinish, setGetDataFinish] = useState(false);
	const [show, setShow] = useState(false);

	const dataRef = useRef('');
	const inputRefHashtag = useRef(null);
	const inputRefAuthor = useRef(null);
	const inputRefBook = useRef(null);
	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const hastagRegex = /(#[a-z0-9][a-z0-9\-_]*)/gi;

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

	const dispatch = useDispatch();

	const getSuggestionForCreatQuotes = async (input, option) => {
		try {
			const data = await dispatch(getSuggestionForPost({ input, option })).unwrap();
			if (option.value === 'addCategory') {
				setCategorySearchedList(data.rows);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinish(true);
		}
	};

	const debounceSearch = useCallback(
		_.debounce((inputValue, option) => getSuggestionForCreatQuotes(inputValue, option), 700),
		[]
	);

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

	const removeCategory = categoryId => {
		const categoryArr = [...categoryAddedList];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		if (categoryAddedList.length <= 5) {
			setCategoryAddedList(categoryArr);
		}
	};

	const searchCategory = e => {
		setGetDataFinish(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		debounceSearch(e.target.value, { value: 'addCategory' });
		if (categoryInputWrapper.current) {
			categoryInputWrapper.current.style.width = categoryInput.current.value.length + 0.5 + 'ch';
		}
	};

	const getDataAuthor = async () => {
		const params = {
			filter: JSON.stringify([
				{ 'operator': 'search', 'value': `${inputAuthors}`, 'property': 'fullName,lastName,firstName' },
			]),
		};
		try {
			const res = await dispatch(getRandomAuthor(params)).unwrap();
			setUserList(
				res.filter(
					item =>
						item.fullName.toLowerCase().includes(inputAuthors.toLowerCase()) ||
						item.firstName.toLowerCase().includes(inputAuthors.toLowerCase()) ||
						item.lastName.toLowerCase().includes(inputAuthors.toLowerCase())
				)
			);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getBookData = async () => {
		const params = {
			filter: JSON.stringify([{ 'operator': 'search', 'value': `${inputBook}`, 'property': 'name' }]),
		};
		try {
			const res = await dispatch(getBookList(params)).unwrap();
			setListBooks(res.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		const categoryIdArr = [];
		for (let i = 0; i < categoryAddedList.length; i++) {
			categoryIdArr.push(categoryAddedList[i].id);
		}
		setCategoryIdBook(categoryIdArr);
	}, [categoryAddedList]);

	useEffect(() => {
		uploadImageFile();
	}, [acceptedFiles]);

	useEffect(() => {
		setLastTag(
			inputHashtag
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/đ/g, 'd')
				.replace(/Đ/g, 'D')
		);
	}, [inputHashtag]);

	const uploadImageFile = async () => {
		const imageUploadedData = await dispatch(uploadImage(acceptedFiles)).unwrap();
		setImgUrl(imageUploadedData?.streamPath);
	};

	useEffect(() => {
		const hashTagElement = document.getElementById('hashtag');
		const handleHashTag = e => {
			if (e.keyCode === 32 && hastagRegex.test(inputHashtag)) {
				dataRef.current = inputHashtag.trim();
				inputRefHashtag.current.value = '';
			}
		};
		hashTagElement.addEventListener('keydown', handleHashTag);

		return () => hashTagElement.removeEventListener('keydown', handleHashTag);
	}, [inputHashtag]);

	useEffect(() => {
		const dataCheck = listHashtags.filter(item => dataRef.current === item);

		if (dataRef.current !== '' && dataCheck.length < 1) {
			const check = dataRef.current
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/đ/g, 'd')
				.replace(/Đ/g, 'D');
			const newList = [...listHashtags, check];
			setListHashtags(newList);
		}
	}, [dataRef.current]);

	const onInputChange = f => e => {
		f(e.target.value.trim());
		if (!hastagRegex.test(inputHashtag)) {
			setShow(true);
		} else {
			setShow(false);
		}
	};

	useEffect(() => {
		if (inputAuthors !== '') {
			getDataAuthor();
		} else setUserList([]);
	}, [inputAuthors]);

	useEffect(() => {
		if (inputBook !== '') {
			getBookData();
		} else setListBooks([]);
	}, [inputBook]);

	useEffect(() => {
		if (
			kindOfGroup.value !== 'default' &&
			imgUrl !== undefined &&
			!_.isEmpty(listAuthors) &&
			(lastTag.includes('#') || !_.isEmpty(listHashtags)) &&
			inputDiscription !== '' &&
			inputNameGroup !== ''
		) {
			setIsShowBtn(true);
		} else {
			setIsShowBtn(false);
		}
	}, [imgUrl, listAuthors, lastTag, kindOfGroup, inputDiscription, inputNameGroup, listHashtags]);

	const creatGroup = async () => {
		const listIdAuthor = listAuthors.map(item => item.id);
		const newListHastag = listHashtags.map(item => `${item}`);
		let newList;
		if (lastTag.includes('#')) {
			newList = [...newListHastag, lastTag];
		} else {
			newList = newListHastag;
		}
		const newIdBook = listBookAdd.map(item => item.id);
		const data = {
			name: inputNameGroup,
			description: inputDiscription,
			avatar: imgUrl,
			groupType: kindOfGroup.value,
			authorIds: listIdAuthor,
			tags: newList,
			categoryIds: categoryIdBook,
			bookIds: newIdBook,
		};

		try {
			await dispatch(getCreatGroup(data)).unwrap();
			const customId = 'custom-id-PopupCreateGroup';
			toast.success('Tạo nhóm thành công', { toastId: customId });
			dispatch(handleResetGroupList());
		} catch (err) {
			NotificationError(err);
		} finally {
			handleClose();
		}
	};

	const listKindOfGroup = [
		{ value: 'book', title: 'Sách' },
		{ value: 'author', title: 'Tác giả' },
		{ value: 'category', title: ' Chia sẻ' },
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
	};

	const onchangeBookCategory = data => {
		setCategoryIdBook([data.value]);
	};

	useEffect(() => {
		setKindOfGroup(kindOfGroupRef.current);
	}, [kindOfGroupRef.current]);

	const handleAddAuthors = e => {
		const checkItem = listAuthors.filter(item => item.id === e.id);
		if (checkItem.length < 1) {
			setListAuthors([...listAuthors, e]);
		}
		inputRefAuthor.current.value = '';
		setUserList([]);
	};

	const handleAddBook = e => {
		const checkItem = listBookAdd.filter(item => item.id === e.id);
		if (checkItem.length < 1) {
			setListBookAdd([...listBookAdd, e]);
		}
		inputRefBook.current.value = '';
		setListBooks([]);
	};

	const handleRemove = e => {
		const newList = listAuthors.filter(item => item.id !== e.id);
		setListAuthors(newList);
	};

	const handleRemoveBook = e => {
		const newList = listBookAdd.filter(item => item !== e);
		setListBookAdd(newList);
	};

	const handleRemoveTag = e => {
		const newList = listHashtags.filter(item => item !== e);
		setListHashtags(newList);
	};
	useEffect(() => {
		if (inputRefAuthor.current) {
			inputRefAuthor.current.focus();
		}
	}, [listAuthors]);

	useEffect(() => {
		if (inputRefBook.current) {
			inputRefBook.current.focus();
		}
	}, [listBookAdd]);

	useEffect(() => {
		groupNameInput.current.focus();
	}, []);

	return (
		<>
			<div className='popup-group__header'>
				<h3>Tạo nhóm</h3>
				<button onClick={handleClose}>
					<CloseIconX />
				</button>
			</div>

			<div>
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
										<span style={{ color: 'red', paddingTop: '5px' }}>(bắt buộc)</span>
									</div>
								</div>
							)}
						</Dropzone>
					)}
				</div>
			</div>
			<div className='form-field-wrapper'>
				<div className='form-field-name'>
					<label>Tên nhóm</label>
					<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
					<Input
						inputRef={groupNameInput}
						isBorder={false}
						placeholder='Tên nhóm'
						handleChange={onInputChange(setInputNameGroup)}
					/>
				</div>

				<div className='form-field-select__kind-of-group'>
					<label>Kiểu nội dung</label>
					<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
					<SelectBox
						name='kindofgroup'
						list={listKindOfGroup}
						defaultOption={kindOfGroupRef.current}
						onChangeOption={onchangeKindOfGroup}
					/>
				</div>
				{kindOfGroup.value === 'book' && (
					<div className='form-field-select__kind-of-group'>
						<label>Chủ đề sách</label>
						<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
						<SelectBox
							name='categoryBook'
							list={listIdBook}
							defaultOption={categoryBookRef.current}
							onChangeOption={onchangeBookCategory}
						/>
					</div>
				)}

				{kindOfGroup.value == 'author' && (
					<div className='form-field-select__kind-of-group'>
						<label>Chủ đề </label>
						<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
						<AddAndSearchCategories
							categoryAddedList={categoryAddedList}
							categorySearchedList={categorySearchedList}
							addCategory={addCategory}
							removeCategory={removeCategory}
							getDataFinish={getDataFinish}
							searchCategory={searchCategory}
							inputCategoryValue={inputCategoryValue}
							categoryInputContainer={categoryInputContainer}
							categoryInputWrapper={categoryInputWrapper}
							categoryInput={categoryInput}
							hasSearchIcon={true}
						/>
					</div>
				)}

				{kindOfGroup.value == 'category' && (
					<div className='form-field-select__kind-of-group'>
						<label>Chủ đề </label>
						<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
						<AddAndSearchCategories
							categoryAddedList={categoryAddedList}
							categorySearchedList={categorySearchedList}
							addCategory={addCategory}
							removeCategory={removeCategory}
							getDataFinish={getDataFinish}
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
					<span style={{ color: 'red', marginLeft: '4px' }}>*</span>

					<div className='list__author-tags' onClick={() => inputRefAuthor.current.focus()}>
						{listAuthors.length > 0 ? (
							<div className='input__authors '>
								{listAuthors.map(item => (
									<span key={item.id}>
										{item.fullName || `${item.firstName + ' ' + item.lastName}`}
										<button
											className='close__author'
											onClick={() => {
												handleRemove(item);
											}}
										>
											<CloseIconX />
										</button>
									</span>
								))}
							</div>
						) : (
							''
						)}
						<Input
							isBorder={false}
							placeholder='Nhập từ khóa'
							handleChange={onInputChange(setInputAuthors)}
							inputRef={inputRefAuthor}
						/>
					</div>
					<div className='author__list'>
						{userlist?.length > 0
							? userlist?.map(item => {
									return (
										<>
											<span
												key={item}
												className='author__item'
												onClick={() => handleAddAuthors(item)}
											>
												{item.fullName || `${item.firstName + ' ' + item.lastName}`}
											</span>
										</>
									);
							  })
							: ''}
					</div>
				</div>

				{kindOfGroup.value === 'book' && (
					<div className='form-field-authors'>
						<label>Tên sách</label>
						<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
						<div className='list__author-tags' onClick={() => inputRefBook.current.focus()}>
							{listBookAdd.length > 0 ? (
								<div className=' book-list'>
									{listBookAdd.map(item => (
										<span key={item.id} className='item-b'>
											{item?.name}
											<button
												className='close__author'
												onClick={() => {
													handleRemoveBook(item);
												}}
											>
												<CloseIconX />
											</button>
										</span>
									))}
								</div>
							) : (
								''
							)}
							<Input
								isBorder={false}
								placeholder='Nhập từ khóa'
								handleChange={onInputChange(setInputBook)}
								inputRef={inputRefBook}
							/>
						</div>
						{/* tên sách */}
						<div className='author__list'>
							{!!listBooks?.length &&
								listBooks?.map(item => {
									return (
										<span key={item} className='author__item' onClick={() => handleAddBook(item)}>
											{item?.name}
										</span>
									);
								})}
						</div>
					</div>
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
				<div className='form-field-hashtag'>
					<label>Hashtags</label>
					<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
					<div className='list__author-tags' onClick={() => inputRefHashtag.current.focus()}>
						{listHashtags.length > 0 && (
							<div className='input__authors'>
								{listHashtags.map(item => (
									<>
										<span key={item}>
											{item}
											<button
												className='close__author'
												onClick={() => {
													handleRemoveTag(item);
												}}
											>
												<CloseIconX />
											</button>
										</span>
									</>
								))}
							</div>
						)}
						<Input
							id='hashtag'
							isBorder={false}
							placeholder='Nhập hashtag'
							handleChange={onInputChange(setInputHashtag)}
							inputRef={inputRefHashtag}
						/>
					</div>
					{show && !!inputHashtag ? <span>Vui lòng nhập đúng định dạng</span> : ''}
				</div>
				<div className={!isShowBtn ? 'disableBtn' : `form-button`} onClick={() => creatGroup()}>
					<button>Tạo nhóm</button>
				</div>
			</div>
		</>
	);
};

PopupCreateGroup.propTypes = {
	handleClose: PropTypes.func,
	showRef: PropTypes.object,
};

export default PopupCreateGroup;
