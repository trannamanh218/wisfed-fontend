import React, { useState } from 'react';
import avatar from 'assets/images/image22.png';
import PropTypes from 'prop-types';
import { calculateDurationTime } from 'helpers/Common';
import UserAvatar from 'shared/user-avatar';
import Button from 'shared/button';
const NotificationStatus = ({ data }) => {
	const renderButton = data => {
		if (data.isAccept === true || data.isRefuse === true) {
			return;
		} else {
			return (
				<div className='notificaiton__main__all__friend'>
					<Button className='notificaiton__main__all__accept'>
						{data.status === 'browse' ? 'Duyệt' : 'Chấp nhận'}
					</Button>
					<Button className='notificaiton__main__all__refuse'>Từ chối</Button>
				</div>
			);
		}
	};
	if (JSON.stringify(data) !== '{}') {
		return (
			<div key={data.id} className='notificaiton__tabs__main__all'>
				<div className='notificaiton__all__main__layout'>
					<UserAvatar size='mm' source={avatar} />
					<div className='notificaiton__all__main__layout__status'>
						<div className='notificaiton__main__all__infor'>
							<p dangerouslySetInnerHTML={{ __html: data?.message }}></p>
						</div>
						<div className={data.isSeen ? 'notificaiton__all__status__seen' : 'notificaiton__all__status'}>
							{`${calculateDurationTime(data.time)}`}
						</div>
						{data.isAccept ? (
							<div className='notificaiton___main__all__status'>Đã chấp nhận lời mời</div>
						) : (
							data.isRefuse(<div className='notificaiton___main__all__status'>Đã từ chối lời mời</div>)
						)}
					</div>

					<div
						className={data.isSeen ? 'notificaiton__main__all__seen' : 'notificaiton__main__all__unseen'}
					></div>
				</div>
				{data.status ? renderButton(data) : ''}
			</div>
		);
	}

	return <p>Không có dữ liệu</p>;
};

NotificationStatus.defaultProps = {
	data: {},
};

NotificationStatus.propTypes = {
	data: PropTypes.object,
};
export default NotificationStatus;
