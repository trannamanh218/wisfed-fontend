import React, { useRef } from 'react';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import { BackArrow } from 'components/svg';
import './group-settings.scss';
import PropTypes from 'prop-types';

function SettingsGroup({ handleChange }) {
	// const listTransparent = [
	// 	{ value: 'public', title: 'Công khai', img: <CheckIcon /> },
	// 	{ value: 'private', title: 'Riêng tư', img: <CheckIcon /> },
	// ];

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
	return (
		<div className='group-settings__container'>
			<div className='group-settings__title'>
				<button onClick={() => handleChange('tabs')}>
					<BackArrow />
				</button>
				<h2>Cài đặt</h2>
			</div>
			<hr />
			<div className='group-settings__form'>
				<div className='group-settings__title-content'>
					<h3>Thiết lập nhóm</h3>
				</div>
				<div className='form-field-wrapper'>
					<div className='form-field-name'>
						<label>Tên nhóm</label>
						<Input isBorder={false} placeholder='Tên nhóm' />
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
						<label>Tên tác giả </label>
						<Input isBorder={false} placeholder='nhập từ khóa' />
					</div>
					<div className='form-field--discription'>
						<label>Giới thiệu</label>
						<textarea ref={textArea} className='form-field-textarea' rows={10} />
					</div>
					<div className='form-field--hashtag'>
						<label>Hashtag</label>
						<Input isBorder={false} placeholder='' />
					</div>

					<div className='group-manage__title__content'>
						<h3>Quản lý thành viên và nội dung</h3>
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
					<div className='form-field-select__kind-of-group'>
						<label>Kiểu nội dung</label>
						<SelectBox
							name='kindofgroup'
							list={listKindOfGroup}
							defaultOption={kindOfGroupRef.current}
							onChangeOption={onchangeKindOfGroup}
						/>
					</div>
					<div>
						<span>Phê duyệt bài viết</span> <button></button>
					</div>
					<div className='form-button'>
						<button>Lưu thay đổi</button>
					</div>
				</div>
			</div>
		</div>
	);
}

SettingsGroup.propTypes = {
	handleChange: PropTypes.func,
};

export default SettingsGroup;
