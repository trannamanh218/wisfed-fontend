import React from 'react';
import PropTypes from 'prop-types';
import FormCheckGroup from 'shared/form-check-group';
import { Form } from 'react-bootstrap';

const MultipleRadio = ({ list, name, value }) => {
	if (list && list.length) {
		return (
			<Form className='multiple-radio'>
				{list.map((item, index) => (
					<FormCheckGroup key={index} data={item} name={name} type='radio' value={value} />
				))}
			</Form>
		);
	}

	return <p>Không có dữ liệu</p>;
};

MultipleRadio.defaultProps = {
	list: [],
	name: 'default',
	value: 'default',
};

MultipleRadio.propTypes = {
	list: PropTypes.array,
	name: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default MultipleRadio;
