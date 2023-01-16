import PropTypes from 'prop-types';
import './button.scss';
import classNames from 'classnames';

const Button = ({ children, onClick, size, varient, isOutline, className, disabled }) => {
	const classNameButton = classNames({
		'btn': size === 'md',
		[`btn btn-${size}`]: size !== 'md',
		[`btn-outline-${varient}`]: isOutline,
		[`btn-${varient}`]: !isOutline,
		[`${className}`]: className,
	});

	return (
		<button className={classNameButton} onClick={onClick} disabled={disabled}>
			{children}
		</button>
	);
};

Button.defaultProps = {
	children: 'Click  me!',
	onClick: () => {},
	size: 'md',
	varient: 'primary',
	isOutline: false,
	className: '',
	disabled: false,
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
	varient: PropTypes.oneOf([
		'primary',
		'primary-light',
		'primary-dark',
		'secondary',
		'success',
		'success-dark',
		'warning',
		'info',
		'light',
		'dark',
	]),
	isOutline: PropTypes.bool,
	className: PropTypes.string,
	disabled: PropTypes.bool,
};

export default Button;
