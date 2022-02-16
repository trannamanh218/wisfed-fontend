import { Field, Form, Formik } from 'formik';
import { titleBookShelve } from 'helpers/Validation';
import React from 'react';
import PropTypes from 'prop-types';

const AddBookShelveForm = ({ updateBookShelve, setShowInput, showInput, addBookShelves }) => {
	const handleSubmit = values => {
		const title = values.title.trim();
		if (title) {
			updateBookShelve(title);
		}
		setShowInput(false);
	};

	if (showInput) {
		return (
			<Formik
				initialValues={{
					title: '',
				}}
				validationSchema={titleBookShelve}
				onSubmit={handleSubmit}
			>
				{({ handleSubmit }) => (
					<Form data-testid='addShelveForm' onSubmit={handleSubmit}>
						<Field name='title'>
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
			<span className='add-icon'>+</span>
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
