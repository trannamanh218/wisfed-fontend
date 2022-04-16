import PropTypes from 'prop-types';
import './filter-options.scss';
import { Form } from 'react-bootstrap';
import RadioInput from 'shared/radio-input';
import classNames from 'classnames';

const FitlerOptions = ({ list, name, className, defaultOption, handleChangeOption }) => {
	if (list.length) {
		return (
			<Form className={classNames('filter-options', { [`${className}`]: className })}>
				{list.map((item, index) => {
					if (defaultOption.value === item.value) {
						return (
							<RadioInput
								key={`option-${index}`}
								data={item}
								name={name}
								type='radio'
								checked={true}
								handleChange={handleChangeOption}
							/>
						);
					}

					return (
						<RadioInput
							key={`option-${index}`}
							data={item}
							name={name}
							type='radio'
							checked={false}
							handleChange={handleChangeOption}
						/>
					);
				})}
			</Form>
		);
	}

	return null;
};

FitlerOptions.defaultProps = {
	list: [],
	name: 'filter-option',
	className: '',
	defaultOption: { id: 1, title: 'Tất cả', value: 'all' },
	handleChangeOption: () => {},
};

FitlerOptions.propTypes = {
	list: PropTypes.array,
	name: PropTypes.string,
	className: PropTypes.string,
	defaultOption: PropTypes.object,
	handleChangeOption: PropTypes.func,
};

export default FitlerOptions;
