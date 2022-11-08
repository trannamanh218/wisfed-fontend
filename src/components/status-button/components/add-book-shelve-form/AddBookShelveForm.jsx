import { Field, Form, Formik } from 'formik';
import { nameBookShelve } from 'helpers/Validation';
import PropTypes from 'prop-types';
import { Add } from 'components/svg';

const AddBookShelveForm = ({ updateBookShelve, setShowInput, showInput, addBookShelves }) => {
	const handleSubmit = values => {
		const name = values.name.trim();
		if (name) {
			const params = { name };
			updateBookShelve(params);
		}
		setShowInput(false);
	};

	if (showInput) {
		return (
			<Formik
				initialValues={{
					name: '',
				}}
				validationSchema={nameBookShelve}
				onSubmit={handleSubmit}
			>
				{({ handleSubmit }) => (
					<Form data-testid='addShelveForm' onSubmit={handleSubmit}>
						<Field name='name'>
							{({ field, meta }) => {
								return (
									<>
										<input
											data-testid='input'
											className='status-book-modal__input'
											type='text'
											placeholder='Nhập để thêm giá sách'
											{...field}
											autoFocus
										/>
										{meta.touched && meta.error && (
											<small className='error-message'>{meta.error}</small>
										)}
									</>
								);
							}}
						</Field>
					</Form>
				)}
			</Formik>
		);
	}

	return (
		<button className='status-book-modal__addBtn' onClick={addBookShelves}>
			<Add className='add-icon' />
			<span>Thêm giá sách</span>
		</button>
	);
};

AddBookShelveForm.propTypes = {
	updateBookShelve: PropTypes.func,
	setShowInput: PropTypes.func,
	showInput: PropTypes.bool,
	addBookShelves: PropTypes.func,
};

export default AddBookShelveForm;
