import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { backgroundToggle } from 'reducers/redux-utils/notificaiton';
import UserAvatar from 'shared/user-avatar';
import { calculateDurationTime } from 'helpers/Common';
import { useNavigate } from 'react-router-dom';
import { ReplyFriendRequest, CancelFriendRequest } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { renderMessage } from 'helpers/HandleShare';
import { readNotification } from 'reducers/redux-utils/notificaiton';
import PropTypes from 'prop-types';
import { addFollower } from 'reducers/redux-utils/user';
import { handleListNotification, handleListUnRead } from 'reducers/redux-utils/notificaiton';
const ModalItem = ({
	item,
	setModalNotti,
	getNotifications,
	setGetNotifications,
	getListUnread,
	selectKey,
	setGetListUnRead,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const addFollow = items => {
		const param = {
			data: { userId: items.actor },
		};
		dispatch(addFollower(param)).unwrap();
	};

	const ReplyFriendReq = async (data, items) => {
		try {
			const parseObject = JSON.parse(data);
			const params = { id: parseObject.requestId, data: { reply: true } };
			let newListArr = [];
			if (selectKey === 'unread') {
				newListArr = getListUnread;
			} else {
				newListArr = getNotifications;
			}
			const newArr = newListArr.map(item => {
				if (items.id === item.id) {
					const data = { ...item, isAccept: true };
					return { ...data };
				}
				return { ...item };
			});
			if (selectKey === 'unread') {
				setGetListUnRead(newArr);
				// dispatch(handleListUnRead(newArr));
			} else {
				setGetNotifications(newArr);
				// dispatch(handleListNotification(newArr));
			}
			await dispatch(ReplyFriendRequest(params)).unwrap();
			await dispatch(readNotification({ notificationId: items.id })).unwrap();
			addFollow(items);
		} catch (err) {
			NotificationError(err);
		}
	};

	const cancelFriend = async (data, items) => {
		try {
			const parseObject = JSON.parse(data);
			const params = { id: parseObject.requestId, data: { level: 'normal' } };
			let newListArr = [];
			if (selectKey === 'unread') {
				newListArr = getListUnread;
			} else {
				newListArr = getNotifications;
			}
			const newArr = newListArr.map(item => {
				if (items.id === item.id) {
					const data = { ...item, isRefuse: true };
					return { ...data };
				}
				return { ...item };
			});

			if (selectKey === 'unread') {
				setGetListUnRead(newArr);
				// dispatch(handleListUnRead(newArr));
			} else {
				setGetNotifications(newArr);
				// dispatch(handleListNotification(newArr));
			}
			await dispatch(CancelFriendRequest(params)).unwrap();
			await dispatch(readNotification({ notificationId: items.id })).unwrap();
		} catch (err) {
			NotificationError(err);
		}
	};

	const hanleActiveIsReed = items => {
		const params = {
			notificationId: items.id,
		};

		if (
			items.verb === 'likeMiniPost' ||
			items.verb === 'commentMiniPost' ||
			items.verb === 'likeGroupPost' ||
			items.verb === 'commentGroupPost'
		) {
			navigate(
				`/detail-feed/${items.verb === 'commentMiniPost' ? 'MiniPost' : 'GroupPost'}/${
					items.originId.minipostId || items.originId.groupPostId
				}`
			);
		} else if (items.verb === 'follow' || items.verb === 'addFriend') {
			navigate(`/profile/${items.createdBy.id}`);
		}

		let newListArr = [];
		if (selectKey === 'unread') {
			newListArr = getListUnread;
		} else {
			newListArr = getNotifications;
		}
		const newArr = newListArr.map(item => {
			if (items.id === item.id) {
				const data = { ...item, isRead: true };
				return { ...data };
			}
			return { ...item };
		});
		if (selectKey === 'unread') {
			setGetListUnRead(newArr);
			// dispatch(handleListUnRead(newArr));
		} else {
			setGetNotifications(newArr);
			// dispatch(handleListNotification(newArr));
		}
		dispatch(backgroundToggle(true));
		setModalNotti(false);
		dispatch(readNotification(params)).unwrap();
	};

	return (
		<div
			key={item.id}
			className={
				item.isRead || item.isAccept || item.isRefuse
					? 'notificaiton__tabs__all__active'
					: 'notificaiton__tabs__all__seen'
			}
		>
			<div onClick={() => hanleActiveIsReed(item)} className='notificaiton__all__layout'>
				<UserAvatar size='mm' source={item.createdBy?.avatarImage} />
				<div className='notificaiton__all__layout__status'>
					<div className='notificaiton__all__infor'>
						<p dangerouslySetInnerHTML={{ __html: item?.message }}></p>
						{item.verb !== 'follow' &&
							item.verb !== 'requestGroup' &&
							item.verb !== 'commentGroupPost' &&
							item.verb !== 'commentQuote' &&
							item.verb !== 'mention' && (
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
									</span>{' '}
									{renderMessage(item)}
								</>
							)}
					</div>
					<div
						className={
							item.isRead || item.isAccept || item.isRefuse
								? 'notificaiton__all__status__seen'
								: 'notificaiton__all__status'
						}
					>{`${calculateDurationTime(item.time)}`}</div>
					{item.isAccept ? (
						<div className='notificaiton___main__all__status'>Đã chấp nhận lời mời</div>
					) : (
						item.isRefuse && <div className='notificaiton___main__all__status'>Đã từ chối lời mời</div>
					)}
				</div>
				<div
					className={
						item.isRead || item.isAccept || item.isRefuse
							? 'notificaiton__all__seen'
							: 'notificaiton__all__unseen'
					}
				></div>
			</div>
			{item.verb === 'addFriend' &&
				(item.isAccept || item.isRefuse ? (
					''
				) : (
					<div className='notificaiton__all__friend'>
						<div onClick={() => ReplyFriendReq(item.object, item)} className='notificaiton__all__accept'>
							Chấp nhận
						</div>
						<div onClick={() => cancelFriend(item.object, item)} className='notificaiton__all__refuse'>
							Từ chối
						</div>
					</div>
				))}
		</div>
	);
};

ModalItem.propTypes = {
	item: PropTypes.object,
	setModalNotti: PropTypes.func,
	getNotifications: PropTypes.array,
	setGetNotifications: PropTypes.func,
	getListUnread: PropTypes.array,
	selectKey: PropTypes.string,
	setGetListUnRead: PropTypes.func,
};
export default ModalItem;
