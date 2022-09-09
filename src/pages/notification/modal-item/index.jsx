import { backgroundToggle, readNotification } from 'reducers/redux-utils/notificaiton';
import UserAvatar from 'shared/user-avatar';
import { calculateDurationTime } from 'helpers/Common';
import { useNavigate } from 'react-router-dom';
import { ReplyFriendRequest, addFollower } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { renderMessage } from 'helpers/HandleShare';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateUser } from 'reducers/redux-utils/user';

const ModalItem = ({ item, setModalNoti, getNotifications, setGetNotifications, selectKey }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const { isReload } = useSelector(state => state.user);

	const [buttonNotClicked, setButtonNotClicked] = useState(true);

	const ReplyFriendReq = async (data, items) => {
		setButtonNotClicked(false);
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { reply: true } };
		try {
			await dispatch(ReplyFriendRequest(params)).unwrap();
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
			await dispatch(readNotification({ notificationId: items.id })).unwrap();
			await dispatch(addFollower({ userId: items.actor })).unwrap();
			dispatch(updateUser(!isReload));
		} catch (err) {
			NotificationError(err);
		}
	};

	const cancelFriend = async (data, items) => {
		setButtonNotClicked(false);
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { reply: false } };
		try {
			await dispatch(ReplyFriendRequest(params)).unwrap();
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
			navigate(`/group/${items.originId.groupId}`);
		} else if (items.verb === 'replyComment' || items.verb === 'shareQuote') {
			navigate(`/detail-feed/${'mini-post'}/${items.originId.minipostId}`);
		} else if (
			items.verb === 'commentQuote' ||
			item.verb === 'replyCommentQuote' ||
			items.verb === 'likeQuote' ||
			items.verb === 'likeCommentQuote'
		) {
			navigate(`/quotes/detail/${items.originId.quoteId}`);
		} else if (items.verb === 'mention') {
			if (items.originId.type === 'commentQuote') {
				navigate(`/quotes/detail/${items.originId.quoteId}`);
			} else if (items.originId.type === 'groupPost') {
				navigate(`/detail-feed/${'group-post'}/${items.originId.groupPostId}`);
			} else {
				navigate(`/detail-feed/${'mini-post'}/${items.originId.minipostId}`);
			}
		} else if (item.verb === 'likeCommentReview') {
			navigate(`/detail-feed/${'mini-post'}/${items.originId.minipostId}`);
		} else if (item.verb === 'requestGroup') {
			navigate(`/group/${items.originId.groupId}`);
		} else if (item.verb === 'likeReview') {
			navigate(`/review/${items.originId.bookId}/${userInfo.id}`);
		} else if (item.verb === 'likeCommentMiniPost') {
			navigate(`/detail-feed/mini-post/${items.originId.minipostId}`);
		} else if (item.verb === 'sharePost') {
			navigate(`/detail-feed/mini-post/${items.originId.minipostId}`);
		}
		dispatch(backgroundToggle(true));
		setModalNoti(false);
		dispatch(readNotification(params)).unwrap();
	};

	return (
		<div
			className={
				(item.isRead || item.isAccept || item.isRefuse) && item.verb !== 'addFriend'
					? 'notificaiton__tabs__all__active'
					: 'notificaiton__tabs__all__seen'
			}
		>
			<div onClick={() => hanleActiveIsReed(item)} className='notificaiton__all__layout'>
				<UserAvatar size='mm' source={item.createdBy?.avatarImage} />
				<div className='notificaiton__all__layout__status'>
					<div className='notificaiton__all__infor'>
						{item.message ? (
							<p dangerouslySetInnerHTML={{ __html: item?.message }}></p>
						) : (
							<>
								{item.verb !== 'follow' &&
									item.verb !== 'requestGroup' &&
									item.verb !== 'commentGroupPost' &&
									item.verb !== 'commentQuote' &&
									item.verb !== 'inviteGroup' &&
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
			{buttonNotClicked ? (
				<>
					{item.verb === 'addFriend' && (!item.isAccept || !item.isRefuse) && (
						<div className='notificaiton__all__friend'>
							<div
								onClick={() => ReplyFriendReq(item.object, item)}
								className='notificaiton__all__accept'
							>
								Chấp nhận
							</div>
							<div onClick={() => cancelFriend(item.object, item)} className='notificaiton__all__refuse'>
								Từ chối
							</div>
						</div>
					)}
				</>
			) : (
				''
			)}
		</div>
	);
};

ModalItem.propTypes = {
	item: PropTypes.object,
	setModalNoti: PropTypes.func,
	getNotifications: PropTypes.array,
	setGetNotifications: PropTypes.func,
	getListUnread: PropTypes.array,
	selectKey: PropTypes.string,
	setGetListUnRead: PropTypes.func,
};
export default ModalItem;
