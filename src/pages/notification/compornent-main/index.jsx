import './nottification.scss';
import { BackArrow } from 'components/svg';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import avater from 'assets/images/image22.png';
import NormalContainer from 'components/layout/normal-container';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import { getNotification } from 'reducers/redux-utils/notificaiton';
import { ReplyFriendRequest, CancelFriendRequest } from 'reducers/redux-utils/user';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { calculateDurationTime } from 'helpers/Common';

const Notification = () => {
	const [getNotifications, setGetNotifications] = useState([]);
	const keyTabsActive = useSelector(state => state.notificationReducer.activeKeyTabs);
	const dispatch = useDispatch();

	const getMyNotification = async () => {
		try {
			const notificationList = await dispatch(getNotification()).unwrap();
			const arrNew = notificationList.map(item => item.activities).flat(1);
			const newArr = arrNew.map(item => {
				const data = { ...item, isAccept: false, isRefuse: false, isRead: false };
				return { ...data };
			});
			setGetNotifications(newArr);
			return;
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	const ReplyFriendReq = (data, items) => {
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { reply: true } };
		dispatch(ReplyFriendRequest(params)).unwrap();
		const newArr = getNotifications.map(item => {
			if (items.id === item.id) {
				const data = { ...item, isAccept: true };
				return { ...data };
			}
			return { ...item };
		});
		setGetNotifications(newArr);
	};

	const cancelFriend = (data, items) => {
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { level: 'normal' } };
		dispatch(CancelFriendRequest(params)).unwrap();
		const newArr = getNotifications.map(item => {
			if (items.id === item.id) {
				const data = { ...item, isRefuse: true };
				return { ...data };
			}
			return { ...item };
		});
		setGetNotifications(newArr);
	};

	useEffect(() => {
		getMyNotification();
	}, [dispatch]);

	const lengthAddFriend = () => {
		const length = getNotifications.filter(item => item.verb === 'addfriend' && !item.isCheck);
		return length.length;
	};

	const renderMessage = item => {
		if (item.verb === 'addfriend') {
			return 'đã gửi lời mời kết bạn';
		} else if (item.verb === 'commentMinipost') {
			return 'đã bình luận vào bài viết của bạn';
		}
	};

	return (
		<NormalContainer>
			<div className='notificaiton__main'>
				<div className='notificaiton__main__container'>
					<Link to={'/'} className='notificaiton__main__back'>
						<BackArrow />
					</Link>
					<div className='notificaiton__main__title'>Thông báo</div>
				</div>
				<div className='notificaiton__tabs_main'>
					<Tabs defaultActiveKey={keyTabsActive ? keyTabsActive : 'all'}>
						<Tab eventKey='all' title='Tất cả'>
							<div className='notificaiton__all__main__title'>Mới nhất</div>
							<div className='notificaiton__tabs__main__all'>
								<div className='notificaiton__all__main__layout'>
									<img className='notificaiton__all__main__layout__image' src={avater} alt='avatar' />
									<div className='notificaiton__all__main__layout__status'>
										<div className='notificaiton__main__all__infor'>
											<span>Trần Huy</span> đã cập nhật Trạng thái Review sách
										</div>
										<div className='notificaiton__all__status'>Gần đây nhất</div>
									</div>
									<div className='notificaiton__main__all__unseen'></div>
								</div>
							</div>
							<div className='notificaiton__all__main__title'>Gần đây</div>
							{getNotifications.map(item =>
								item.isCheck ? (
									''
								) : (
									<div key={item.id} className='notificaiton__tabs__main__all'>
										<div className='notificaiton__all__main__layout'>
											<UserAvatar size='mm' source={item.createdBy.avatarImage} />
											<div className='notificaiton__all__main__layout__status'>
												<div className='notificaiton__main__all__infor'>
													<p dangerouslySetInnerHTML={{ __html: item?.message }}></p>
													{item.verb !== 'follow' && (
														<>
															<span>
																{item.createdBy.fullName ? (
																	item.createdBy.fullName
																) : (
																	<>
																		<span> {item.createdBy.firstName}</span>
																		<span> {item.createdBy.lastName}</span>
																	</>
																)}
															</span>
															&nbsp;
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
													<div className='notificaiton___main__all__status'>
														Đã chấp nhận lời mời
													</div>
												) : (
													item.isRefuse && (
														<div className='notificaiton___main__all__status'>
															Đã từ chối lời mời
														</div>
													)
												)}
											</div>
											<div
												className={
													item.isAccept || item.isRefuse
														? 'notificaiton__main__all__seen'
														: 'notificaiton__main__all__unseen'
												}
											></div>
										</div>

										{item.verb === 'addfriend' &&
											(item.isAccept || item.isRefuse ? (
												''
											) : (
												<div className='notificaiton__main__all__friend'>
													<div
														onClick={() => ReplyFriendReq(item.object, item)}
														className='notificaiton__main__all__accept'
													>
														Chấp nhận
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
								)
							)}
						</Tab>
						<Tab eventKey='unread' title='Chưa đọc'>
							<div className='notificaiton__all__main__title'>Thông báo chưa đọc</div>
							{getNotifications.map(item =>
								item.isCheck ? (
									''
								) : (
									<div key={item.id} className='notificaiton__tabs__main__all'>
										<div className='notificaiton__all__main__layout'>
											<UserAvatar size='mm' source={item.createdBy.avatarImage} />
											<div className='notificaiton__all__main__layout__status'>
												<div className='notificaiton__main__all__infor'>
													<p dangerouslySetInnerHTML={{ __html: item?.message }}></p>
													{item.verb !== 'follow' && (
														<>
															<span>
																{item.createdBy.fullName ? (
																	item.createdBy.fullName
																) : (
																	<>
																		<span> {item.createdBy.firstName}</span>
																		<span> {item.createdBy.lastName}</span>
																	</>
																)}
															</span>
															&nbsp;
															{renderMessage(item)}
														</>
													)}
												</div>
												<div className='notificaiton__all__status'>{`${calculateDurationTime(
													item.time
												)}`}</div>
											</div>
											<div className='notificaiton__main__all__unseen'></div>
										</div>
										{item.verb === 'addfriend' && (
											<div className='notificaiton__main__all__friend'>
												<div
													onClick={() => ReplyFriendReq(item.object, item.id)}
													className='notificaiton__main__all__accept'
												>
													Chấp nhận
												</div>
												<div
													onClick={() => cancelFriend(item.object, item.id)}
													className='notificaiton__main__all__refuse'
												>
													Từ chối
												</div>
											</div>
										)}
									</div>
								)
							)}
						</Tab>
						<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
							<div className='notificaiton__all__main__title'>{lengthAddFriend()}&nbsp;lời kết bạn</div>
							{getNotifications.map(
								item =>
									item.verb === 'addfriend' &&
									!item.isCheck && (
										<div key={item.id} className='notificaiton__tabs__main__all'>
											<div className='notificaiton__all__main__layout'>
												<UserAvatar size='mm' source={item.createdBy.avatarImage} />
												<div className='notificaiton__all__main__layout__status'>
													<div className='notificaiton__main__all__infor'>
														<span>
															{item.createdBy.fullName ? (
																item.createdBy.fullName
															) : (
																<>
																	<span> {item.createdBy.firstName}</span>
																	<span> {item.createdBy.lastName}</span>
																</>
															)}
														</span>
														&nbsp;đã gửi lời mời kết bạn
													</div>

													<div className='notificaiton__all__status'>{`${calculateDurationTime(
														item.time
													)}`}</div>
												</div>
												<div className='notificaiton__main__all__unseen'></div>
											</div>
											<div className='notificaiton__main__all__friend'>
												<div
													onClick={() => ReplyFriendReq(item.object)}
													className='notificaiton__main__all__accept'
												>
													Chấp nhận
												</div>
												<div
													onClick={() => cancelFriend(item.object)}
													className='notificaiton__main__all__refuse'
												>
													Từ chối
												</div>
											</div>
										</div>
									)
							)}
						</Tab>
					</Tabs>
				</div>
			</div>
		</NormalContainer>
	);
};

export default Notification;
