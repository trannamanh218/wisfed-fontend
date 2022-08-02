import { Field, Form, Formik } from 'formik';
import { nameBookShelve } from 'helpers/Validation';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Add from 'assets/icons/add.svg';

const AddSeriesForm = ({ updateBookShelve }) => {
	const [showInput, setShowInput] = useState(false);

	const addSeries = () => {
		if (!showInput) {
			setShowInput(true);
		}
	};

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
											style={{ height: '49px' }}
											data-testid='input'
											className='status-book-modal__input'
											type='text'
											placeholder='Nhập để thêm tên sê-ri'
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
		<div className='modal-series__body__button' onClick={addSeries}>
			<img src={Add} />
			<span>Thêm tên sê-ri</span>
		</div>
	);
};

AddSeriesForm.propTypes = {
	updateBookShelve: PropTypes.func,
	setShowInput: PropTypes.func,
	showInput: PropTypes.bool,
	addSeries: PropTypes.func,
};

export default AddSeriesForm;
