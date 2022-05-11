import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './form-check-group.scss';

const FormCheckGroup = ({ type, handleChange, defaultValue, ...rest }) => {
	const { data, name } = rest;
	const { title } = data;
	return (
		<div key={type} className='form-check-wrapper'>
			<Form.Check className='form-check-custom' type={type} id={title}>
				<Form.Check.Input
					className={`form-check-custom--${type}`}
					type={type}
					isValid
					name={name}
					value={data.value}
					onChange={() => handleChange(data.value)}
					defaultChecked={data.value === defaultValue}
				/>
				<Form.Check.Label className='form-check-label--custom'>{data.title}</Form.Check.Label>
			</Form.Check>
		</div>
	);
};

FormCheckGroup.defaultProps = {
	type: 'radio',
	data: {
		title: 'Title 1',
		value: 1,
	},
	name: 'group1',
	defaultValue: 'default',
	handleChange: () => {},
};

FormCheckGroup.propTypes = {
	type: PropTypes.oneOf(['checkbox', 'radio']),
	data: PropTypes.shape({
		title: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}),
	name: PropTypes.string,
	handleChange: PropTypes.func,
	defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default FormCheckGroup;
