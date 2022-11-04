import PropTypes from 'prop-types';
import './filter-options.scss';
import { Form } from 'react-bootstrap';
import RadioInput from 'shared/radio-input';
import classNames from 'classnames';

const FitlerOptions = ({ list, name, className, currentOption, handleChangeOption }) => {
	return (
		<Form className={classNames('filter-options', { [`${className}`]: className })}>
			{!!list.length > 0 &&
				list.map((item, index) => {
					return (
						<RadioInput
							key={`option-${index}`}
							data={item}
							name={name}
							type='radio'
							checked={currentOption.value === item.value}
							handleChange={handleChangeOption}
						/>
					);
				})}
		</Form>
	);
};

FitlerOptions.defaultProps = {
	list: [],
	name: 'filter-option',
	className: '',
	currentOption: { id: 1, title: 'Tất cả', value: 'all' },
	handleChangeOption: () => {},
};

FitlerOptions.propTypes = {
	list: PropTypes.array,
	name: PropTypes.string,
	className: PropTypes.string,
	currentOption: PropTypes.object,
	handleChangeOption: PropTypes.func,
};

export default FitlerOptions;
