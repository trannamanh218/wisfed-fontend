import { CameraIcon, CloseIconX } from 'components/svg';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-bootstrap';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import './creat-group.scss';
import { getUserList } from 'reducers/redux-utils/user';

const PopupCreatGroup = ({ handleClose }) => {
	const [inputNameGroup, setInputNameGroup] = useState('');
	const [inputDiscription, setInputDiscription] = useState('');
	const [inputAuthors, setInputAuthors] = useState('');
	const [userlist, setUserList] = useState([]);
	const dispatch = useDispatch();
	const [listAuthor, setListAuthors] = useState([]);
	const [inputHashtag, setInputHashtag] = useState('');
	const [listHashtags, setListHashtags] = useState([]);
	const dataRef = useRef('');
	const inputRefHashtag = useRef(null);

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

	const listKindOfGroup = [
		{ value: 'book', title: 'Sách' },
		{ value: 'authors', title: 'Tác giả' },
		{ value: 'share', title: ' Chia sẻ' },
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
	const onInputChange = f => e => f(e.target.value);

	const handleAddAuthors = e => {
		if (listAuthor.length === 0) {
			setListAuthors([...listAuthor, e]);
		} else if (listAuthor.filter(item => item !== e)) {
			setListAuthors([...listAuthor, e]);
		}
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
					<div className='dropzone upload-image'>
						<CameraIcon />
						<Image className='upload-image__icon' />
						<p className='upload-image__description'>Thêm ảnh từ thiết bị</p>
						<span>hoặc kéo thả</span>
					</div>
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
						{listAuthor.length > 0 ? (
							<div className='input__authors'>
								{listAuthor.map(item => (
									<>
										<span>{item}</span>
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
						/>
					</div>

					<div className='author__list'>
						{userlist.length > 0
							? userlist.map(item => {
									return (
										<>
											<span
												className='author__item'
												onClick={() =>
													handleAddAuthors(
														item?.fullName || `${item?.firstName + ' ' + item?.lastName}`
													)
												}
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
								{listHashtags.map((item, index) => (
									<>
										{' '}
										<span>{item}</span>
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
				<div className='form-button'>
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
