// import ShareModeDropdown from 'shared/share-mode-dropdown';
import PropTypes from 'prop-types';
import Input from 'shared/input';
import { Add, Pencil, TrashIcon, UndoIcon } from 'components/svg';
import _ from 'lodash';
import { useState } from 'react';

function GroupType({
	dataArray,
	intialDataArray,
	socialsMediaInputValue,
	updateInputValue,
	userSocialsMediaRef,
	editStatus,
	cancelEdit,
	enableEdit,
	addSocialsMediaLink,
	setUserSocialsMedia,
}) {
	const [isEditting, setIsEditting] = useState(false);

	const renderAddSocialsMediaLink = () => {
		return (
			<div className='form-field-wrapper'>
				<div className='form-field'>
					<Input
						isBorder={true}
						placeholder='Nhập link'
						value={socialsMediaInputValue}
						handleChange={e => updateInputValue(e, 'edit-socials-media')}
						inputRef={userSocialsMediaRef}
					/>
				</div>
				<div className='form-field__btn save' onClick={addSocialsMediaLink}>
					Lưu
				</div>
				<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-socials-media')}>
					Hủy
				</div>
			</div>
		);
	};

	const updateText = (e, index) => {
		const cloneArr = [...dataArray];
		cloneArr[index] = e.target.value;
		setUserSocialsMedia(cloneArr);
	};

	const updateItem = e => {
		if (e.keyCode == 13) {
			setIsEditting(false);
		}
	};

	const deleteItem = index => {
		const cloneArr = [...dataArray];
		cloneArr.splice(index, 1);
		setUserSocialsMedia(cloneArr);
	};

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>URL Mạng xã hội khác</label>
			{!_.isEmpty(dataArray) ? (
				<>
					{!isEditting ? (
						<>
							{dataArray.map((item, index) => (
								<div className='form-field-wrapper socials-link' key={index}>
									<div className='form-field'>
										<div className='form-field-filled'>{item}</div>
									</div>
									{/* <ShareModeDropdown /> */}
									{!editStatus && index === dataArray.length - 1 && (
										<>
											<div className='btn-icon' onClick={() => enableEdit('socials-editting')}>
												<Add />
											</div>
											<div className='btn-icon' onClick={() => setIsEditting(true)}>
												<Pencil />
											</div>
										</>
									)}
								</div>
							))}
							{editStatus && renderAddSocialsMediaLink()}
						</>
					) : (
						<>
							{dataArray.map((item, index) => (
								<div className='form-field-wrapper socials-link' key={index}>
									<div className='form-field'>
										<input
											className='form-field-filled'
											value={item}
											onChange={e => updateText(e, index)}
											onKeyDown={e => updateItem(e)}
										></input>
									</div>
									<div
										className='btn-icon'
										onClick={() => {
											deleteItem(index);
										}}
									>
										<TrashIcon />
									</div>
								</div>
							))}
							<div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
								<div
									className='form-field__btn save'
									onClick={() => setUserSocialsMedia(intialDataArray)}
								>
									Khôi phục
								</div>
								<div className='form-field__btn cancel' onClick={() => setIsEditting(false)}>
									Thoát
								</div>
							</div>
						</>
					)}
				</>
			) : (
				<>
					{editStatus ? (
						renderAddSocialsMediaLink()
					) : (
						<div className='form-field-wrapper'>
							<div className='form-field'>
								<div className='form-field__no-data'>Chưa có dữ liệu</div>
							</div>
							{intialDataArray && !dataArray.length ? (
								<div
									className='form-field__btn save'
									style={{ width: '110px' }}
									onClick={() => setUserSocialsMedia(intialDataArray)}
								>
									Khôi phục
								</div>
							) : (
								''
							)}
							<div className='btn-icon' onClick={() => enableEdit('socials-editting')}>
								<Add />
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}

GroupType.propTypes = {
	dataArray: PropTypes.array,
	socialsMediaInputValue: PropTypes.string,
	updateInputValue: PropTypes.func,
	userSocialsMediaRef: PropTypes.object,
	editStatus: PropTypes.bool,
	cancelEdit: PropTypes.func,
	enableEdit: PropTypes.func,
	addSocialsMediaLink: PropTypes.func,
};

export default GroupType;
