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
import { useSelector } from 'react-redux';
import { handleSaveUpdate } from 'reducers/redux-utils/user';

const ModalItem = ({ item, setModalNotti, getNotifications, setGetNotifications, selectKey }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const { isreload } = useSelector(state => state.user);

	const ReplyFriendReq = async (data, items) => {
		try {
			const parseObject = JSON.parse(data);
			const params = { id: parseObject.requestId, data: { reply: true } };

			if (selectKey !== 'unread') {
				const newArr = getNotifications.map(item => {
					if (items.id === item.id) {
						const data = { ...item, isAccept: true };
						return { ...data };
					}
					return { ...item };
				});
				setGetNotifications(newArr);
			}
			await dispatch(ReplyFriendRequest(params)).unwrap();
			await dispatch(readNotification({ notificationId: items.id })).unwrap();
			await dispatch(handleSaveUpdate(!isreload));
			dispatch(addFollower({ userId: items.actor }));
		} catch (err) {
			NotificationError(err);
		}
	};

	const cancelFriend = async (data, items) => {
		try {
			const parseObject = JSON.parse(data);
			const params = { id: parseObject.requestId, data: { reply: false } };

			if (selectKey !== 'unread') {
				const newArr = getNotifications.map(item => {
					if (items.id === item.id) {
						const data = { ...item, isRefuse: true };
						return { ...data };
					}
					return { ...item };
				});
				setGetNotifications(newArr);
			}
			await dispatch(ReplyFriendRequest(params)).unwrap();
			await dispatch(readNotification({ notificationId: items.id })).unwrap();
			await dispatch(handleSaveUpdate(!isreload));
		} catch (err) {
			// NotificationError(err);
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
				`/detail-feed/${
					items.verb === 'commentMiniPost' || items.verb === 'likeMiniPost' ? 'mini-post' : 'group-post'
				}/${items.originId?.minipostId || items.originId?.groupPostId}`
			);
		} else if (items.verb === 'follow' || items.verb === 'addFriend' || items.verb === 'friendAccepted') {
			navigate(`/profile/${items.createdBy?.id || items.originId.userId}`);
		} else if (item.verb === 'topUserRanking') {
			navigate(`/top100`);
		} else if (item.verb === 'readingGoal') {
			navigate(`/reading-target/${userInfo.id}`);
		} else if (item.verb === 'inviteGroup') {
			navigate(`/Group/${items.originId.groupId}`);
		} else if (items.verb === 'replyComment' || items.verb === 'shareQuote') {
			navigate(`/detail-feed/${'mini-post'}/${items.originId.minipostId}`);
		} else if (items.verb === 'commentQuote') {
			navigate(`/quotes/detail/${items.originId.quoteId}`);
		} else if (items.verb === 'mention') {
			navigate(`/detail-feed/${'mini-post'}/${items.originId.minipostId}`);
		} else if (items.verb === 'likeQuote') {
			navigate(`/quotes/detail/${items.originId.quoteId}`);
		}
		dispatch(backgroundToggle(true));
		setModalNotti(false);
		dispatch(readNotification(params)).unwrap();
	};

	return (
		<div
			className={
				item.isRead || item.isAccept || item.isRefuse
					? 'notificaiton__tabs__all__active'
					: 'notificaiton__tabs__all__seen'
			}
		>
			<div onClick={() => hanleActiveIsReed(item)} className='notificaiton__all__layout'>
				<UserAvatar size='mm' source={item.createdBy?.avatarImage || userInfo.avatarImage} />
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
