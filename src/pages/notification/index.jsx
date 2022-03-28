import './modal-notification.scss';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import avater from 'assets/images/image22.png';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { backgroundToggle, activeKeyTabsNotification } from 'reducers/redux-utils/notificaiton';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserAvatar from 'shared/user-avatar';
import { getNotification } from 'reducers/redux-utils/notificaiton';
import { calculateDurationTime } from 'helpers/Common';
import { useNavigate } from 'react-router-dom';

const NotificationModal = ({ setModalNotti, buttonModal }) => {
	const notifymodal = useRef(null);
	const [selectKey, setSelectKey] = useState('all');
	const dispatch = useDispatch();
	const history = useLocation();
	const [getNotifications, setGetNotifications] = useState([]);
	// const keyTabsActive = useSelector(state => state.notificationReducer.activeKeyTabs);
	const navigate = useNavigate();
	const handleClickOutside = e => {
		if (notifymodal.current && !notifymodal.current.contains(e.target) && !buttonModal.current.contains(e.target)) {
			setModalNotti(false);
			dispatch(backgroundToggle(true));
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	const getMyNotification = async () => {
		try {
			const notificationList = await dispatch(getNotification()).unwrap();
			const arrNew = notificationList.map(item => item.activities).flat(1);
			const newArr = arrNew.map(item => {
				const data = { ...item, isRead: false };
				return { ...data };
			});
			setGetNotifications(newArr);
			return;
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	const hanleActiveIsReed = items => {
		const newArr = getNotifications.map(item => {
			if (item.id === items.id) {
				const data = { ...item, isRead: true };
				return { ...data };
			}
			return { ...item };
		});
		setGetNotifications(newArr);
	};

	useEffect(() => {
		getMyNotification();
	}, []);

	const lengthAddFriend = () => {
		const length = getNotifications.filter(item => item.verb === 'addfriend' && !item.isCheck);
		return length.length;
	};

	const handleLinkAddfriend = item => {
		if (item.verb === 'addfriend') {
			navigate('/profile');
			dispatch(backgroundToggle(true));
			setModalNotti(false);
		}
	};

	const renderMessage = item => {
		if (item.verb === 'addfriend') {
			return 'đã gửi lời mời kết bạn';
		} else if (item.verb === 'commentMinipost') {
			return 'đã bình luận vào bài viết của bạn';
		}
	};

	const handleNotificaiton = () => {
		dispatch(backgroundToggle(true));
		setModalNotti(false);
		if (history.pathname === '/notification') {
			toast.warning('Bạn đang ở đây rồi');
		} else {
			dispatch(activeKeyTabsNotification(selectKey));
		}
	};

	return (
		<div className='notificaiton'>
			<div ref={notifymodal} className='notificaiton__container'>
				<div className='notificaiton__title'>Thông báo</div>
				<div className='notificaiton__tabs'>
					<Tabs onSelect={eventKey => setSelectKey(eventKey)} defaultActiveKey='all'>
						<Tab eventKey='all' title='Tất cả'>
							<div className='notificaiton__all__title'>Mới nhất</div>

							<div className='notificaiton__tabs__all__seen'>
								<div className='notificaiton__all__layout'>
									<UserAvatar size='mm' source={avater} />
									<div className='notificaiton__all__layout__status'>
										<div className='notificaiton__all__infor'>
											<span>Huy Đạt</span> đã đăng trong nhóm Thời đại sách 5.0 247: Nhóm khác có
											vẻ cập nhật tốt hơn anh em mình nh...
										</div>
										<div className='notificaiton__all__status'>Khoảng 30 giờ trước</div>
									</div>
									<div className='notificaiton__all__unseen'></div>
								</div>
							</div>
							<div className='notificaiton__all__title'>Gần đây</div>
							{getNotifications.map(item =>
								item.isCheck ? (
									''
								) : (
									<div
										onClick={() => hanleActiveIsReed(item)}
										key={item.id}
										className={
											item.isRead
												? 'notificaiton__tabs__all__active'
												: 'notificaiton__tabs__all__seen'
										}
									>
										<div
											onClick={() => {
												handleLinkAddfriend(item);
											}}
											className='notificaiton__all__layout'
										>
											<UserAvatar size='mm' source={item.createdBy.avatarImage} />
											<div className='notificaiton__all__layout__status'>
												<div className='notificaiton__all__infor'>
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
														item.isRead
															? 'notificaiton__all__status__seen'
															: 'notificaiton__all__status'
													}
												>{`${calculateDurationTime(item.time)}`}</div>
											</div>
											<div
												className={
													item.isRead
														? 'notificaiton__all__seen'
														: 'notificaiton__all__unseen'
												}
											></div>
										</div>
										{item.verb === 'addfriend' && (
											<div className='notificaiton__all__friend'>
												<div className='notificaiton__all__accept'>Chấp nhận</div>
												<div className='notificaiton__all__refuse'>Từ chối</div>
											</div>
										)}
									</div>
								)
							)}
							<Link
								to={`/notification`}
								onClick={handleNotificaiton}
								className='notificaiton__tabs__button'
							>
								Xem tất cả
							</Link>
						</Tab>
						<Tab eventKey='unread' title='Chưa đọc'>
							<div className='notificaiton__all__title'>Thông báo chưa đọc</div>
							{getNotifications.map(item => (
								<div
									onClick={() => hanleActiveIsReed(item)}
									key={item.id}
									className={
										item.isRead
											? 'notificaiton__tabs__all__active'
											: 'notificaiton__tabs__all__seen'
									}
								>
									<div
										onClick={() => {
											handleLinkAddfriend(item);
										}}
										className='notificaiton__all__layout'
									>
										<UserAvatar size='mm' source={item.createdBy.avatarImage} />
										<div className='notificaiton__all__layout__status'>
											<div className='notificaiton__all__infor'>
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
										<div
											className={
												item.isRead ? 'notificaiton__all__seen' : 'notificaiton__all__unseen'
											}
										></div>
									</div>
									{item.verb === 'addfriend' && (
										<div className='notificaiton__all__friend'>
											<div className='notificaiton__all__accept'>Chấp nhận</div>
											<div className='notificaiton__all__refuse'>Từ chối</div>
										</div>
									)}
								</div>
							))}
							<Link
								to={`/notification`}
								onClick={handleNotificaiton}
								className='notificaiton__tabs__button'
							>
								Xem tất cả
							</Link>
						</Tab>
						<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
							<div className='notificaiton__all__title'>{lengthAddFriend()} lời kết bạn</div>
							{getNotifications.map(
								item =>
									item.verb === 'addfriend' &&
									(item.isCheck ? (
										''
									) : (
										<div
											onClick={() => hanleActiveIsReed(item)}
											key={item.id}
											className={
												item.isRead
													? 'notificaiton__tabs__all__active'
													: 'notificaiton__tabs__all__seen'
											}
										>
											<div className='notificaiton__all__layout'>
												<UserAvatar size='mm' source={item.createdBy.avatarImage} />
												<div className='notificaiton__all__layout__status'>
													<div className='notificaiton__all__infor'>
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
												<div
													className={
														item.isRead
															? 'notificaiton__all__seen'
															: 'notificaiton__all__unseen'
													}
												></div>
											</div>
											{item.verb === 'addfriend' && (
												<div className='notificaiton__all__friend'>
													<div className='notificaiton__all__accept'>Chấp nhận</div>
													<div className='notificaiton__all__refuse'>Từ chối</div>
												</div>
											)}
										</div>
									))
							)}
							<Link
								to={`/notification`}
								onClick={handleNotificaiton}
								className='notificaiton__tabs__button'
							>
								Xem tất cả
							</Link>
						</Tab>
					</Tabs>
				</div>
			</div>
		</div>
	);
};
NotificationModal.propTypes = {
	setModalNotti: PropTypes.func,
	buttonModal: PropTypes.object,
};
export default NotificationModal;
