import { Add, Minus } from 'components/svg';
import React, { useState } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import './connect-buttons.scss';

const ConnectButtons = ({ data, direction }) => {
	const [infor, setInfor] = useState(data);

	const handleAddFriend = () => {
		setInfor(prev => ({ ...prev, isFriend: !prev.isFriend }));
	};

	const handleFollow = () => {
		setInfor(prev => ({ ...prev, isFollow: !prev.isFollow }));
	};
	return (
		<div className={`connect-buttons ${direction}`}>
			<Button className='connect-button' isOutline={true} name='friend' onClick={handleAddFriend}>
				{!infor.isFriend ? (
					<Add className='connect-button__icon' />
				) : (
					<Minus className='connect-button__icon' />
				)}
				<span className='connect-button__content'>{infor.isFriend ? 'Huỷ kết bạn' : 'Kết bạn'}</span>
			</Button>
			<Button className='connect-button follow' onClick={handleFollow}>
				<span className='connect-button__content'>{infor.isFollow ? 'Hủy theo dõi' : 'Theo dõi'}</span>
			</Button>
		</div>
	);
};

ConnectButtons.defaultProps = {
	data: {
		isFriend: false,
		isFollow: false,
	},
	direction: 'column',
};

ConnectButtons.propTypes = {
	data: PropTypes.shape({
		isFollow: PropTypes.bool.isRequired,
		isFriend: PropTypes.bool.isRequired,
	}),
	direction: PropTypes.oneOf(['row', 'column']),
};

export default ConnectButtons;
