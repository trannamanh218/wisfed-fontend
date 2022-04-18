import PropTypes from 'prop-types';
import FormCheckGroup from 'shared/form-check-group';
import { Form } from 'react-bootstrap';

const MultipleCheckbox = ({ list, defaultValue }) => {
	if (list && list.length) {
		return (
			<Form className='multiple-checkbox'>
				{list.map((item, index) => (
					<FormCheckGroup
						key={index}
						data={item}
						name={item.title}
						defaultValue={defaultValue}
						type='checkbox'
					/>
				))}
			</Form>
		);
	}

	return <p>Không có dữ liệu</p>;
};

MultipleCheckbox.defaultProps = {
	list: [],
	name: '',
	defaultValue: '',
};

MultipleCheckbox.propTypes = {
	list: PropTypes.array,
	name: PropTypes.string,
	defaultValue: PropTypes.any,
};

export default MultipleCheckbox;
