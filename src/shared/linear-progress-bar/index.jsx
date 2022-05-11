import PropTypes from 'prop-types';
import './linear-progress-bar.scss';

const LinearProgressBar = ({ percent, variant, height, label }) => {
	const styleBar = {
		width: `${percent}%`,
	};

	const style = {
		height: `${height}rem`,
	};

	return (
		<div className='linear-progress' style={style}>
			<div className={`linear-progress-bar bg-${variant}`} style={styleBar}>
				{label ? label : ''}
			</div>
		</div>
	);
};

LinearProgressBar.defaultProps = {
	percent: 50,
	variant: 'primary',
	height: 0.5,
	label: '',
};

LinearProgressBar.propTypes = {
	percent: PropTypes.any.isRequired,
	variant: PropTypes.oneOf([
		'primary',
		'primary-light',
		'primary-dark',
		'secondary',
		'success',
		'success-light',
		'success-dark',
		'warning',
		'info',
		'light',
		'dark',
	]),
	height: PropTypes.number,
	label: PropTypes.string,
};

export default LinearProgressBar;
