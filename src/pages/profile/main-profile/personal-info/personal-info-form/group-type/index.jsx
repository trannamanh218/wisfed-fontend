// import ShareModeDropdown from 'shared/share-mode-dropdown';
import PropTypes from 'prop-types';
import Input from 'shared/input';
import { Add, TrashIcon } from 'components/svg';
import _ from 'lodash';
import { useState } from 'react';
import classNames from 'classnames';

function GroupType({
	dataArray,
	userSocialsMediaRef,
	editStatus,
	cancelEdit,
	enableEdit,
	addSocialsMediaLink,
	deleteSocialsMediaLink,
}) {
	const [inputValue, setInputValue] = useState('');

	const renderAddSocialsMediaLink = () => {
		return (
			<div className='form-field-wrapper'>
				<div className='form-field'>
					<Input
						isBorder={true}
						placeholder='Nhập link'
						value={inputValue}
						handleChange={e => setInputValue(e.target.value)}
						inputRef={userSocialsMediaRef}
					/>
				</div>
				<div
					className={classNames('form-field__btn save', {
						'disabled': !inputValue.trim().length,
					})}
					onClick={handleAddSocialsMediaLink}
				>
					Lưu
				</div>
				<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-socials-media')}>
					Hủy
				</div>
			</div>
		);
	};

	const handleAddSocialsMediaLink = () => {
		if (inputValue.trim().length) {
			setInputValue('');
			addSocialsMediaLink(inputValue);
		}
	};

	return (
		<div className='form-field-group'>
			<label
				className='form-field-label'
				style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
			>
				<span>URL Mạng xã hội khác</span>
				{/* <ShareModeDropdown /> */}
				<div
					className={classNames('btn-icon', { 'hidden': editStatus })}
					onClick={() => enableEdit('socials-editting')}
				>
					<Add />
				</div>
			</label>

			{!_.isEmpty(dataArray) ? (
				<>
					{dataArray.map((item, index) => (
						<div className='form-field-wrapper socials-link' key={index}>
							<div className='form-field'>
								<div className='form-field-filled'>{item}</div>
							</div>
							<div
								className='btn-icon'
								onClick={() => {
									deleteSocialsMediaLink(index);
								}}
							>
								<TrashIcon />
							</div>
						</div>
					))}
					{editStatus && renderAddSocialsMediaLink()}
				</>
			) : (
				<>
					{editStatus ? (
						renderAddSocialsMediaLink()
					) : (
						<div className='form-field__no-data'>Chưa có dữ liệu</div>
					)}
				</>
			)}
		</div>
	);
}

GroupType.defaultProps = {
	dataArray: [],
	userSocialsMediaRef: {},
	editStatus: false,
	cancelEdit: () => {},
	enableEdit: () => {},
	addSocialsMediaLink: () => {},
	deleteSocialsMediaLink: () => {},
};

GroupType.propTypes = {
	dataArray: PropTypes.array,
	userSocialsMediaRef: PropTypes.object,
	editStatus: PropTypes.bool,
	cancelEdit: PropTypes.func,
	enableEdit: PropTypes.func,
	addSocialsMediaLink: PropTypes.func,
	deleteSocialsMediaLink: PropTypes.func,
};

export default GroupType;
