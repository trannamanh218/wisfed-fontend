import { CameraIcon, CloseIconX } from 'components/svg';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-bootstrap';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import './create-group.scss';
import { getRandomAuthor } from 'reducers/redux-utils/user';
import { getBookList } from 'reducers/redux-utils/book';
import { getCreatGroup, getIdCategory } from 'reducers/redux-utils/group';
import Dropzone from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from 'reducers/redux-utils/common';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { toast } from 'react-toastify';

const PopupCreateGroup = ({ handleClose, showRef }) => {
	const [inputNameGroup, setInputNameGroup] = useState('');
	const [inputDiscription, setInputDiscription] = useState('');
	const [inputAuthors, setInputAuthors] = useState('');
	const [inputBook, setInputBook] = useState('');
	const [userlist, setUserList] = useState([]);
	const dispatch = useDispatch();
	const [listBooks, setListBooks] = useState([]);
	const [listAuthors, setListAuthors] = useState([]);
	const [listBookAdd, setListBookAdd] = useState([]);
	const [inputHashtag, setInputHashtag] = useState('');
	const [listHashtags, setListHashtags] = useState([]);
	const dataRef = useRef('');
	const inputRefHashtag = useRef(null);
	const inputRefAuthor = useRef(null);
	const inputRefBook = useRef(null);
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
	const [imgUrl, setImgUrl] = useState('');
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [kindOfGroup, setKindOfGroup] = useState('');
	const [idBook, setIDBook] = useState([]);
	const [categoryIdBook, setCategoryIdBook] = useState('');

	const getDataAuthor = async () => {
		const params = {
			filter: JSON.stringify([
				{ 'operator': 'search', 'value': `${inputAuthors}`, 'property': 'fullName,lastName,firstName' },
			]),
		};
		try {
			const res = await dispatch(getRandomAuthor(params)).unwrap();
			setUserList(res);
		} catch (err) {
			Notification(err);
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
			Notification(err);
		}
	};

	const bookCategoryId = async () => {
		try {
			const res = await dispatch(getIdCategory()).unwrap();
			setIDBook(res.rows);
		} catch (err) {
			Notification(err);
		}
	};

	useEffect(() => {
		if (kindOfGroup.value == 'book') {
			bookCategoryId();
		} else {
			setIDBook([]);
		}
	}, [kindOfGroup.value]);

	useEffect(() => {
		uploadImageFile();
	}, [acceptedFiles]);

	const uploadImageFile = async () => {
		const imageUploadedData = await dispatch(uploadImage(acceptedFiles)).unwrap();
		setImgUrl(imageUploadedData?.streamPath);
	};

	useEffect(() => {
		document.getElementById('hashtag').addEventListener('keydown', e => {
			if (e.keyCode === 32) {
				dataRef.current = inputHashtag.trim();
				inputRefHashtag.current.value = '';
			}
		});
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
			!_.isEmpty(listHashtags) &&
			inputDiscription !== '' &&
			inputNameGroup !== ''
		) {
			setIsShowBtn(true);
		} else {
			setIsShowBtn(false);
		}
	}, [imgUrl, listAuthors, listHashtags, kindOfGroup, inputDiscription, inputNameGroup]);

	const creatGroup = async () => {
		const listIdAuthor = listAuthors.map(item => item.id);
		const newListHastag = listHashtags.map(item => `#${item}`);
		const newIdBook = listBookAdd.map(item => item.id);
		const bookId = idBook.map(item => item.id);
		const data = {
			name: inputNameGroup,
			description: inputDiscription,
			avatar: imgUrl,
			groupType: kindOfGroup.value,
			authorIds: listIdAuthor,
			tags: newListHastag,
			categoryIds: [categoryIdBook],
			bookIds: newIdBook,
		};
		try {
			await dispatch(getCreatGroup(data)).unwrap();
			const customId = 'custom-id-PopupCreateGroup';
			toast.success('Tạo nhóm thành công', { toastId: customId });
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
		setCategoryIdBook(data.value);
	};

	useEffect(() => {
		setKindOfGroup(kindOfGroupRef.current);
	}, [kindOfGroupRef.current]);
	const onInputChange = f => e => f(e.target.value);

	const handleAddAuthors = e => {
		try {
			const checkItem = listAuthors.filter(item => item.id === e.id);
			if (checkItem.length < 1) {
				setListAuthors([...listAuthors, e]);
			}
		} catch (err) {
			// console.log(err);
		} finally {
			inputRefAuthor.current.value = '';
			setUserList([]);
		}
	};

	const handleAddBook = e => {
		try {
			const checkItem = listBookAdd.filter(item => item.id === e.id);
			if (checkItem.length < 1) {
				setListBookAdd([...listBookAdd, e]);
			}
		} catch (err) {
			// console.log(err);
		} finally {
			inputRefBook.current.value = '';
			setListBooks([]);
		}
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

	return (
		<>
			{/* <div className='popup-group__container' ref={showRef}> */}
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
					<Input isBorder={false} placeholder='Tên nhóm' handleChange={onInputChange(setInputNameGroup)} />
				</div>

				<div className='form-field-select__kind-of-group'>
					<label>Kiểu nội dung</label>
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
						<SelectBox
							name='categoryBook'
							list={listIdBook}
							defaultOption={categoryBookRef.current}
							onChangeOption={onchangeBookCategory}
						/>
					</div>
				)}

				<div className='form-field-authors'>
					<label>Tên tác giả</label>
					<div className='list__author-tags'>
						{listAuthors.length > 0 ? (
							<div className='input__authors '>
								{listAuthors.map(item => (
									<span key={item.id}>
										{item.fullName ? item.fullName : `${item.firstName + ' ' + item.lastName}`}
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
												{item.fullName
													? item.fullName
													: `${item.firstName + ' ' + item.lastName}`}
											</span>
										</>
									);
							  })
							: ''}
					</div>
				</div>

				{/*  */}
				{kindOfGroup.value === 'book' && (
					<div className='form-field-authors'>
						<label>Tên sách</label>
						<div className='list__author-tags'>
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
							{listBooks?.length > 0
								? listBooks?.map(item => {
										return (
											<>
												<span
													key={item}
													className='author__item'
													onClick={() => handleAddBook(item)}
												>
													{item?.name}
												</span>
											</>
										);
								  })
								: ''}
						</div>
					</div>
				)}

				<div className='form-field--discription'>
					<label>Giới thiệu</label>
					<textarea
						ref={textArea}
						className='form-field-textarea'
						rows={10}
						onChange={onInputChange(setInputDiscription)}
					/>
				</div>
				<div className='form-field--hastag'>
					<label>Hastag</label>
					<div className='list__author-tags'>
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
				</div>
				<div className={!isShowBtn ? 'disableBtn' : `form-button`} onClick={() => creatGroup()}>
					<button>Tạo nhóm</button>
				</div>
			</div>
			{/* </div> */}
		</>
	);
};

PopupCreateGroup.propTypes = {
	handleClose: PropTypes.func,
	showRef: PropTypes.object,
};

export default PopupCreateGroup;
