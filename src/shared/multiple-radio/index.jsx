import PropTypes from 'prop-types';
import FormCheckGroup from 'shared/form-check-group';
import { Form } from 'react-bootstrap';

const MultipleRadio = ({ list, name, defaultValue, handleChange }) => {
	if (list && list.length) {
		return (
			<Form className='multiple-radio'>
				{list.map((item, index) => (
					<FormCheckGroup
						key={index}
						data={item}
						name={name}
						type='radio'
						defaultValue={defaultValue}
						handleChange={handleChange}
					/>
				))}
			</Form>
		);
	}

	return <p>Không có dữ liệu</p>;
};

MultipleRadio.defaultProps = {
	list: [],
	name: 'default',
	defaultValue: 'default',
};

MultipleRadio.propTypes = {
	list: PropTypes.array,
	name: PropTypes.string,
	defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	handleChange: PropTypes.func,
};

export default MultipleRadio;
