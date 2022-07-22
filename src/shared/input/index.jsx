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
	type,
	...rest
}) => {
	const blockInvalidChar = e => {
		if (type === 'number') {
			return ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
		}
	};

	return (
		<input
			type={type}
			onKeyDown={blockInvalidChar}
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

Input.defaultProps = {
	type: 'text',
};

Input.propTypes = {
	placeholder: PropTypes.string,
	handleChange: PropTypes.func,
	isBorder: PropTypes.bool,
	className: PropTypes.string,
	inputRef: PropTypes.object,
	readOnly: PropTypes.bool,
	type: PropTypes.string,
};

export default Input;
