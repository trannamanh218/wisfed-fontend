import PropTypes from 'prop-types';
import { calculateDurationTime } from 'helpers/Common';
import UserAvatar from 'shared/user-avatar';
import { renderMessage } from 'helpers/HandleShare';
import { ReplyFriendRequest, CancelFriendRequest } from 'reducers/redux-utils/user';
import { readNotification } from 'reducers/redux-utils/notificaiton';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';

const NotificationStatus = ({ item, setGetNotifications, getNotifications }) => {
	const dispatch = useDispatch();
	const ReplyFriendReq = async (data, items) => {
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { reply: true } };
		try {
			await dispatch(ReplyFriendRequest(params)).unwrap();
			const newArr = getNotifications.map(item => {
				if (items.id === item.id) {
					const data = { ...item, isAccept: true };
					return { ...data };
				}
				return { ...item };
			});
			setGetNotifications(newArr);
		} catch (err) {
			NotificationError(err);
		}
	};

	const cancelFriend = async (data, items) => {
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { level: 'normal' } };
		try {
			await dispatch(CancelFriendRequest(params)).unwrap();
			const newArr = getNotifications.map(item => {
				if (items.id === item.id) {
					const data = { ...item, isRefuse: true };
					return { ...data };
				}
				return { ...item };
			});
			setGetNotifications(newArr);
		} catch (err) {
			NotificationError(err);
		}
	};

	const hanleActiveIsReed = items => {
		const params = {
			notificationId: items.id,
		};
		if (items.verb !== 'addfriend') {
			const newArr = getNotifications.map(item => {
				if (item.id === items.id) {
					const data = { ...item, isRead: true };
					return { ...data };
				}
				return { ...item };
			});
			setGetNotifications(newArr);
		}
		dispatch(readNotification(params)).unwrap();
	};

	return (
		<div
			onClick={() => hanleActiveIsReed(item)}
			className={item.isRead ? 'notificaiton__tabs__main__all__active' : 'notificaiton__tabs__main__all__seen'}
		>
			<div className='notificaiton__all__main__layout'>
				<UserAvatar size='mm' source={item.createdBy?.avatarImage} />
				<div className='notificaiton__all__main__layout__status'>
					<div className='notificaiton__main__all__infor'>
						<p dangerouslySetInnerHTML={{ __html: item?.message }}></p>
						{item.verb !== 'follow' && item.verb !== 'requestGroup' && item.vern !== 'commentGroupPost' && (
							<>
								<span>
									{item.createdBy?.fullName ? (
										item.createdBy.fullName
									) : (
										<>
											<span> {item.createdBy?.firstName}</span>
											<span> {item.createdBy?.lastName}</span>
										</>
									)}
								</span>
								{renderMessage(item)}
							</>
						)}
					</div>
					<div
						className={
							item.isAccept || item.isRefuse
								? 'notificaiton__all__status__seen'
								: 'notificaiton__all__status'
						}
					>{`${calculateDurationTime(item?.time)}`}</div>
					{item.isAccept ? (
						<div className='notificaiton___main__all__status'>Đã chấp nhận lời mời</div>
					) : (
						item.isRefuse && <div className='notificaiton___main__all__status'>Đã từ chối lời mời</div>
					)}
				</div>

				<div className={item.isRead ? 'notificaiton__all__seen' : 'notificaiton__all__unseen'}></div>
			</div>

			{item.verb === 'addFriend' &&
				(item.isAccept || item.isRefuse ? (
					''
				) : (
					<div className='notificaiton__main__all__friend'>
						<div
							onClick={() => ReplyFriendReq(item.object, item)}
							className='notificaiton__main__all__accept'
						>
							{item.verb === 'browse' ? 'Duyệt' : 'Chấp nhận'}
						</div>
						<div
							onClick={() => cancelFriend(item.object, item)}
							className='notificaiton__main__all__refuse'
						>
							Từ chối
						</div>
					</div>
				))}
		</div>
	);
};

NotificationStatus.propTypes = {
	item: PropTypes.object,
	setGetNotifications: PropTypes.func,
	getNotifications: PropTypes.object,
};
export default NotificationStatus;
