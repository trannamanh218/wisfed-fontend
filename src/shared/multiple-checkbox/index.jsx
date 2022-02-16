import React from 'react';
import PropTypes from 'prop-types';
import FormCheckGroup from 'shared/form-check-group';
import { Form } from 'react-bootstrap';

const MultipleCheckbox = ({ list, name, value }) => {
	if (list && list.length) {
		return (
			<Form className='multiple-checkbox'>
				{list.map((item, index) => (
					<FormCheckGroup key={index} data={item} name={name} value={value} type='checkbox' />
				))}
			</Form>
		);
	}

	return <p>Không có dữ liệu</p>;
};

MultipleCheckbox.defaultProps = {
	list: [],
	name: '',
};

MultipleCheckbox.propTypes = {
	list: PropTypes.array,
	name: PropTypes.string,
};

export default MultipleCheckbox;
