import React from 'react';
import PropTypes from 'prop-types';
import { CloseIconX } from 'components/svg';

const MiniPopup = ({ handleClose, data }) => {
	const data1 = {
		title: 'Bài viết được kiểm duyệt',

		description: 'Bài viết sẽ được kiêm duyệt bởi quản trị viên. Vui lòng đợi ít phút',
		button: 'Xác nhận',
	};

	return (
		<div className='mini-popup__container'>
			<button onClick={handleClose}>
				<CloseIconX />
			</button>
			<h3>{data1?.title}</h3>
			<div>
				<CloseIconX />
			</div>
			<span>{data1.description}</span>
			<div>
				<button>{data1.button}</button>
			</div>
		</div>
	);
};

MiniPopup.propTypes = {
	handleClose: PropTypes.func,
	data: PropTypes.object,
};
export default MiniPopup;
