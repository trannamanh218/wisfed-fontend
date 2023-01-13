// import ShareModeDropdown from 'shared/share-mode-dropdown';
import { Pencil } from 'components/svg';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import RichTextEditor from 'shared/rich-text-editor';

function TextareaType({ textareaValue, editStatus, updateInputValue, cancelEdit, enableEdit }) {
	return (
		<div className='form-field-group'>
			<label className='form-field-label'>Giới thiệu</label>
			<div
				className={classNames('form-field-wrapper', {
					'form-field-wrapper--custom': textareaValue || editStatus,
				})}
			>
				{editStatus ? (
					<div className='form-field--custom'>
						<div className='form-field-textarea'>
							<RichTextEditor
								placeholder='Nhập lời giới thiệu bản thân'
								setContent={value => updateInputValue(value, 'edit-descriptions')}
								initialContent={textareaValue || ''}
							/>
						</div>
					</div>
				) : (
					<>
						{textareaValue ? (
							<div className='form-field--custom'>
								<div
									className='form-field-textarea'
									dangerouslySetInnerHTML={{ __html: textareaValue }}
								></div>
							</div>
						) : (
							<div className='form-field'>
								<div className='form-field__no-data '>Chưa có dữ liệu</div>
							</div>
						)}
					</>
				)}
				<div className={editStatus || textareaValue ? 'form-field__buttons' : 'form-field__buttons no-data'}>
					{/* <ShareModeDropdown /> */}
					{editStatus ? (
						<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-descriptions')}>
							Hủy
						</div>
					) : (
						<div className='btn-icon' onClick={() => enableEdit('descriptions-editting')}>
							<Pencil />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

TextareaType.propTypes = {
	textareaValue: PropTypes.string,
	editStatus: PropTypes.bool,
	updateInputValue: PropTypes.func,
	cancelEdit: PropTypes.func,
	enableEdit: PropTypes.func,
};

export default TextareaType;
