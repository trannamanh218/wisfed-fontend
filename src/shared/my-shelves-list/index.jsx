import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import Input from 'shared/input';
import StatisticList from 'shared/statistic-list';
import { titleBookShelve } from 'helpers/Validation';
import { useDispatch } from 'react-redux';
import { createLibrary } from 'reducers/redux-utils/library';
import { toast } from 'react-toastify';
import './my-shelves-list.scss';

const MyShelvesList = ({ list }) => {
	const dispatch = useDispatch();

	const handleSubmit = async (values, { resetForm }) => {
		const name = values.title.trim();

		if (name) {
			const params = { name };
			try {
				await dispatch(createLibrary(params));
			} catch (err) {
				toast.error('Lỗi không tạo được tủ sách!');
				resetForm();
			}
		}
	};

	return (
		<div>
			<StatisticList
				className='my-shelves-list'
				title='Giá sách'
				background='light'
				isBackground={false}
				list={list}
			/>
			<Formik
				initialValues={{
					title: '',
				}}
				validationSchema={titleBookShelve}
				onSubmit={handleSubmit}
			>
				<Form>
					<Field name='title'>
						{({ field, meta }) => {
							return (
								<>
									<Input
										className='my-shelves__input'
										type='text'
										placeholder='Nhập để thêm giá sách'
										{...field}
									/>
									{meta.touched && meta.error && (
										<small className='error-message'>{meta.error}</small>
									)}
								</>
							);
						}}
					</Field>
					<button type='submit' className='my-shelves__btn__submit btn btn-primary'>
						Áp dụng
					</button>
				</Form>
			</Formik>
		</div>
	);
};

MyShelvesList.defaultProps = {
	list: [],
};

MyShelvesList.propTypes = {
	list: PropTypes.array,
};

export default MyShelvesList;
