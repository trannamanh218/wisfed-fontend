import React from 'react';
import PropTypes from 'prop-types';
import FormCheckGroup from 'shared/form-check-group';
import { Form } from 'react-bootstrap';

const MultipleCheckbox = ({ list, value }) => {
	if (list && list.length) {
		return (
			<Form className='multiple-checkbox'>
				{list.map((item, index) => (
					<FormCheckGroup key={index} data={item} name={item.data.title} value={value} type='checkbox' />
				))}
			</Form>
		);
	}

	return <p>Không có dữ liệu</p>;
};

MultipleCheckbox.defaultProps = {
	list: [],
	name: '',
	value: '',
};

MultipleCheckbox.propTypes = {
	list: PropTypes.array,
	name: PropTypes.string,
	value: PropTypes.any,
};

export default MultipleCheckbox;
