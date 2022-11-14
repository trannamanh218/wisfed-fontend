import backArrow from 'assets/images/back-arrow.png';
import PropTypes from 'prop-types';
import './back-button.scss';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ destination }) => {
	const navigate = useNavigate();

	const backFnc = () => {
		navigate(destination);
	};

	return (
		<button className='back-btn' onClick={backFnc}>
			<img src={backArrow} alt='back' />
		</button>
	);
};

BackButton.defaultProps = {
	destination: -1,
};

BackButton.propTypes = {
	destination: PropTypes.any,
};

export default BackButton;
