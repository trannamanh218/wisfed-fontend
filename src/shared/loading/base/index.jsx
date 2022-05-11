import PropTypes from 'prop-types';
import './style.scss';
import ModalPortal from 'shared/modal-portal';

function BaseLoading({ loading, children }) {
	return (
		<ModalPortal isOpen={loading}>
			<div className='base-loading__content'>{children}</div>
		</ModalPortal>
	);
}

BaseLoading.propTypes = {
	loading: PropTypes.bool,
	children: PropTypes.any.isRequired,
};

export default BaseLoading;
