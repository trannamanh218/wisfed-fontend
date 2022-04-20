import { CameraIcon, CheckIcon, CloseIconX } from 'components/svg';
import React, { useRef } from 'react';
import { Image } from 'react-bootstrap';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import PropTypes from 'prop-types';

import './creat-group.scss';

const PopupCreatGroup = ({ handleClose }) => {
	const listTransparent = [
		{ value: 'public', title: 'Công khai', img: <CheckIcon /> },
		{ value: 'private', title: 'Riêng tư', img: <CheckIcon /> },
	];

	const listKindOfGroup = [
		{ value: 'book', title: 'Sách' },
		{ value: 'authors', title: 'Tác giả' },
		{ value: 'share', title: ' Chia sẻ' },
	];
	const tranparentRef = useRef({ value: 'public', title: 'Công khai', img: <CheckIcon /> });
	const kindOfGroupRef = useRef({ value: 'default', title: 'Tác giả/ Chia sẻ/ Sách' });
	const textArea = useRef(null);

	const onchangeTransparent = data => {
		tranparentRef.current = data;
	};
	const onchangeKindOfGroup = data => {
		kindOfGroupRef.current = data;
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
					<Input isBorder={false} placeholder='Tên nhóm' />
				</div>
				<div className='form-field-select__transparent'>
					<label>Quyền riêng tư</label>
					<SelectBox
						name='transparent'
						list={listTransparent}
						defaultOption={tranparentRef.current}
						onChangeOption={onchangeTransparent}
					/>
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
				<div className='form-field-authors'>
					<label>Tên tác giả </label>
					<Input isBorder={false} placeholder='nhập từ khóa' />
				</div>
				<div className='form-field--discription'>
					<label>Giới thiệu</label>
					<textarea ref={textArea} className='form-field-textarea' rows={10} />
				</div>
				<div className='form-field--hastag'>
					<label>Hastag</label>
					<Input isBorder={false} placeholder='' />
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
