import SelectBox from 'shared/select-box';
import PropTypes from 'prop-types';
import ShareModeDropdown from 'shared/share-mode-dropdown';
import { useState, useEffect } from 'react';
import { Pencil } from 'components/svg';
import classNames from 'classnames';

function DropdownType({ option, data, editStatus, userData, displayData, cancelEdit, enableEdit }) {
	const [textTranslated, setTextTranslated] = useState('');

	useEffect(() => {
		if (option === 'birthday') {
			setTextTranslated('Ngày sinh');
		} else if (option === 'gender') {
			setTextTranslated('Giới tính');
		}
	}, []);

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>{textTranslated}</label>
			<div className='form-field-wrapper'>
				<div className='form-field'>
					{editStatus ? (
						<>
							{data.map((item, index) => (
								<SelectBox
									key={index}
									name={item.mane}
									list={item.list}
									defaultOption={item.defaultOption}
									onChangeOption={item.onChangeOption}
								/>
							))}
						</>
					) : (
						<>
							{userData ? (
								<div
									className={classNames('form-field-filled', {
										'gender': option === 'gender',
									})}
								>
									{displayData}
								</div>
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

DropdownType.propTypes = {
	option: PropTypes.string,
	data: PropTypes.array,
	editStatus: PropTypes.bool,
	userData: PropTypes.string,
	displayData: PropTypes.string,
	cancelEdit: PropTypes.func,
	enableEdit: PropTypes.func,
};

export default DropdownType;
