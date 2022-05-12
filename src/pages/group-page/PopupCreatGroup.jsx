import { CameraIcon, CloseIconX } from 'components/svg';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-bootstrap';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import './creat-group.scss';
import { getUserList } from 'reducers/redux-utils/user';
import { getCreatGroup } from 'reducers/redux-utils/group';
import Dropzone from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from 'reducers/redux-utils/common';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';

const PopupCreatGroup = ({ handleClose }) => {
	const [inputNameGroup, setInputNameGroup] = useState('');
	const [inputDiscription, setInputDiscription] = useState('');
	const [inputAuthors, setInputAuthors] = useState('');
	const [userlist, setUserList] = useState([]);
	const dispatch = useDispatch();
	const [listAuthors, setListAuthors] = useState([]);
	const [inputHashtag, setInputHashtag] = useState('');
	const [listHashtags, setListHashtags] = useState([]);
	const dataRef = useRef('');
	const inputRefHashtag = useRef(null);
	const inputRefAuthor = useRef(null);
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
	const [imgUrl, setImgUrl] = useState('');
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [kindOfGroup, setKindOfGroup] = useState('');

	// const listTransparent = [
	// 	{ value: 'public', title: 'Công khai', img: <CheckIcon /> },
	// 	{ value: 'private', title: 'Riêng tư', img: <CheckIcon /> },
	// ];

	const getDataAuthor = async () => {
		const params = {
			filter: JSON.stringify([
				{ 'operator': 'search', 'value': `${inputAuthors}`, 'property': 'fullName,lastName,firstName' },
			]),
		};
		try {
			const res = await dispatch(getUserList(params)).unwrap();
			setUserList(res.rows);
		} catch (err) {
			Notification(err);
		}
	};

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
			const newList = [...listHashtags, dataRef.current];
			setListHashtags(newList);
		}
	}, [dataRef.current]);

	useEffect(() => {
		if (inputAuthors !== '') {
			getDataAuthor();
		} else setUserList([]);
	}, [inputAuthors]);

	useEffect(() => {
		if (
			imgUrl !== undefined &&
			listAuthors !== [] &&
			listHashtags !== [] &&
			inputDiscription !== '' &&
			inputNameGroup !== ''
		) {
			setIsShowBtn(true);
		}
	}, [imgUrl, listAuthors, listHashtags, kindOfGroup, inputDiscription, inputNameGroup]);

	const creatGroup = async () => {
		const listIdAuthor = listAuthors.map(item => item.id);
		const data = {
			name: inputNameGroup,
			description: inputDiscription,
			avatar: imgUrl,
			groupType: kindOfGroup.value,
			authorIds: listIdAuthor,
			tags: listHashtags,
			categoryIds: [27, 1, 2, 3, 4],
			bookIds: [13, 44, 212, 435, 124, 2342, 123, 12],
		};
		try {
			await dispatch(getCreatGroup(data)).unwrap();
		} catch (err) {
			NotificationError(err);
		}
	};

	console.log(listHashtags);

	const listKindOfGroup = [
		{ value: 'book', title: 'Sách' },
		{ value: 'author', title: 'Tác giả' },
		{ value: 'category', title: ' Chia sẻ' },
	];
	// const tranparentRef = useRef({ value: 'public', title: 'Công khai', img: <CheckIcon /> });
	const kindOfGroupRef = useRef({ value: 'default', title: 'Tác giả/ Chia sẻ/ Sách' });
	const textArea = useRef(null);

	// const onchangeTransparent = data => {
	// 	tranparentRef.current = data;
	// };
	const onchangeKindOfGroup = data => {
		kindOfGroupRef.current = data;
	};

	useEffect(() => {
		setKindOfGroup(kindOfGroupRef.current);
	}, [kindOfGroupRef.current]);
	const onInputChange = f => e => f(e.target.value);

	const handleAddAuthors = e => {
		const checkItem = listAuthors.filter(item => item === e);
		if (checkItem.length < 1) {
			setListAuthors([...listAuthors, e]);
		}
		inputRefAuthor.current.value = '';
		setUserList([]);
	};

	return (
		<div className='popup-group__container '>
			<div className='popup-group__header'>
				<h3>Tạo nhóm</h3>
				<button onClick={handleClose}>
					<CloseIconX />
				</button>
			</div>

			<div>
				<div className='upload-image__wrapper'>
					{imgUrl ? (
						<img style={{ width: '700px', height: '266px' }} src={imgUrl} alt='img' />
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
				{/* <div className='form-field-select__transparent'>
					<label>Quyền riêng tư</label>
					<SelectBox
						name='transparent'
						list={listTransparent}
						defaultOption={tranparentRef.current}
						onChangeOption={onchangeTransparent}
					/>
				</div> */}
				<div className='form-field-select__kind-of-group'>
					<label>Kiểu nội dung</label>
					<SelectBox
						name='kindofgroup'
						list={listKindOfGroup}
						defaultOption={kindOfGroupRef.current}
						onChangeOption={onchangeKindOfGroup}
					/>
				</div>

				<div className='form-field-authors'>
					<label>Tên tác giả</label>
					<div className='list__author-tags'>
						{listAuthors.length > 0 ? (
							<div className='input__authors'>
								{listAuthors.map(item => (
									<>
										<span>
											{item.fullName ? item.fullName : `${item.firstName + ' ' + item.lastName}`}
										</span>
									</>
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
						{userlist.length > 0
							? userlist.map(item => {
									return (
										<>
											<span
												key={item}
												className='author__item'
												onClick={() => handleAddAuthors(item)}
											>
												{item?.fullName || `${item?.firstName + ' ' + item?.lastName}`}
											</span>
										</>
									);
							  })
							: ''}
					</div>
				</div>

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
										<span key={item}>{item}</span>
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
		</div>
	);
};

PopupCreatGroup.propTypes = {
	handleClose: PropTypes.func,
};

export default PopupCreatGroup;
