import PropTypes from 'prop-types';
import classNames from 'classnames';
import './input.scss';

const Input = ({
	placeholder = 'Viết bình luận...',
	handleChange,
	isBorder = true,
	className = '',
	inputRef,
	readOnly,
	...rest
}) => {
	return (
		<input
			className={classNames(
				'input',
				{ 'input--non-border': !isBorder },
				{ 'input--border': isBorder },
				{ [`${className}`]: className }
			)}
			placeholder={placeholder}
			onChange={handleChange}
			ref={inputRef}
			readOnly={readOnly}
			{...rest}
		/>
	);
};

Input.propTypes = {
	placeholder: PropTypes.string,
	handleChange: PropTypes.func,
	isBorder: PropTypes.bool,
	className: PropTypes.string,
	inputRef: PropTypes.object,
	readOnly: PropTypes.bool,
};

export default Input;
