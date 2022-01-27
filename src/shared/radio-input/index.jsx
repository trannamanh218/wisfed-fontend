import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import './radio-input.scss';

const RadioInput = ({ handleChange, ...rest }) => {
	const { data, name, checked } = rest;
	const { title, value } = data;
	return (
		<Form.Check className='radio-input-container' type='radio' id={title}>
			<Form.Check.Input
				className='radio-input'
				type='radio'
				isValid
				name={name}
				value={value}
				onChange={e => handleChange(e, data)}
				checked={checked}
			/>
			<Form.Check.Label className='form-check-label--custom'>{title}</Form.Check.Label>
		</Form.Check>
	);
};

RadioInput.defaultProps = {
	data: {
		title: 'Title 1',
		value: 1,
	},
	name: 'group1',
	handleChange: () => {},
};

RadioInput.propTypes = {
	data: PropTypes.shape({
		title: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}),
	name: PropTypes.string,
	handleChange: PropTypes.func,
};

export default RadioInput;
