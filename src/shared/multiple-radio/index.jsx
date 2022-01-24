import React from 'react';
import PropTypes from 'prop-types';
import FormCheckGroup from 'shared/form-check-group';
import { Form } from 'react-bootstrap';

const MultipleRadio = ({ list, name }) => {
	if (list && list.length) {
		return (
			<Form className='multiple-radio'>
				{list.map((item, index) => (
					<FormCheckGroup key={index} data={item} name={name} type='radio' />
				))}
			</Form>
		);
	}

	return <p>Không có dữ liệu</p>;
};

MultipleRadio.defaultProps = {
	list: [],
	name: '',
};

MultipleRadio.propTypes = {
	list: PropTypes.array,
	name: PropTypes.string,
};

export default MultipleRadio;
