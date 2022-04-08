import { Pencil } from 'components/svg';
import Input from 'shared/input';
import ShareModeDropdown from 'shared/share-mode-dropdown';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function InputType({ option, editStatus, inputValue, updateInputValue, inputRef, cancelEdit, enableEdit }) {
	const [textTranslated, setTextTranslated] = useState('');

	useEffect(() => {
		if (option === 'address') {
			setTextTranslated('Địa chỉ');
		} else if (option === 'works') {
			setTextTranslated('Công việc');
		}
	}, []);

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>{textTranslated}</label>
			<div className='form-field-wrapper'>
				<div className='form-field'>
					{editStatus ? (
						<Input
							isBorder={true}
							placeholder={`Nhập ${textTranslated.toLowerCase()}`}
							value={inputValue}
							handleChange={e => updateInputValue(e, `edit-${option}`)}
							inputRef={inputRef}
						/>
					) : (
						<>
							{inputValue ? (
								<Input isBorder={false} value={inputValue} disabled />
							) : (
								<div className='form-field__no-data '>Chưa có dữ liệu</div>
							)}
						</>
					)}
				</div>

				<ShareModeDropdown />

				{editStatus ? (
					<div className='form-field__btn cancel' onClick={() => cancelEdit(`cancel-edit-${option}`)}>
						Hủy
					</div>
				) : (
					<div className='btn-icon' onClick={() => enableEdit(`${option}-editting`)}>
						<Pencil />
					</div>
				)}
			</div>
		</div>
	);
}

InputType.propTypes = {
	option: PropTypes.string,
	editStatus: PropTypes.bool,
	inputValue: PropTypes.string,
	updateInputValue: PropTypes.func,
	inputRef: PropTypes.func,
	userData: PropTypes.string,
	cancelEdit: PropTypes.func,
	enableEdit: PropTypes.func,
};

export default InputType;
