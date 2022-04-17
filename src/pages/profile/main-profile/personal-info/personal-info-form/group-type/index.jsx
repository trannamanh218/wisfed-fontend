// import ShareModeDropdown from 'shared/share-mode-dropdown';
import PropTypes from 'prop-types';
import Input from 'shared/input';
import { Add } from 'components/svg';
import _ from 'lodash';

function GroupType({
	dataArray,
	socialsMediaInputValue,
	updateInputValue,
	userSocialsMediaRef,
	editStatus,
	cancelEdit,
	enableEdit,
	addSocialsMediaLink,
}) {
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

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>URL Mạng xã hội khác</label>
			{!_.isEmpty(dataArray) ? (
				<>
					{dataArray.map((item, index) => (
						<div className='form-field-wrapper socials-link' key={index}>
							<div className='form-field'>
								<div className='form-field-filled'>{item}</div>
							</div>

							{/* <ShareModeDropdown /> */}

							{!editStatus && index === dataArray.length - 1 && (
								<div className='btn-icon' onClick={() => enableEdit('socials-editting')}>
									<Add />
								</div>
							)}
						</div>
					))}
					{editStatus && renderAddSocialsMediaLink()}
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
