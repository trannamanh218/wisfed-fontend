import React from 'react';
import PropTypes from 'prop-types';
import Button from 'shared/button';
import { Field, Form, Formik } from 'formik';
import Input from 'shared/input';
import StatisticList from 'shared/statistic-list';
import './my-shelves-list.scss';

const MyShelvesList = ({ list }) => {
	const handleSubmit = () => {};

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
					<Button className='my-shelves__btn__submit'>Áp dụng</Button>
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
