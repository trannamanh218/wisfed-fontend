import './modal-notification.scss';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
	backgroundToggle,
	activeKeyTabsNotification,
	getListNotificationUnRead,
} from 'reducers/redux-utils/notification';
import { getNotification } from 'reducers/redux-utils/notification';
import { NotificationError } from 'helpers/Error';
import LoadingTimeLine from './loading-timeline';
import ModalItem from './modal-item';

const NotificationModal = ({ setModalNoti, buttonModal, realTime }) => {
	const notifymodal = useRef(null);
	const [selectKey, setSelectKey] = useState('all');
	const [isLoading, setIsLoading] = useState(true);
	const [renderFriend, setRenderFriend] = useState(false);
	const [getNotifications, setGetNotifications] = useState([]);
	const [getListUnread, setGetListUnRead] = useState([]);
	const [firstTimeOpenModal, setFirstTimeOpenModal] = useState(false);

	const dispatch = useDispatch();

	const handleClickOutside = e => {
		if (notifymodal.current && !notifymodal.current.contains(e.target) && !buttonModal.current.contains(e.target)) {
			setModalNoti(false);
			dispatch(backgroundToggle(true));
		}
	};

	useEffect(() => {
		if (notifymodal.current) {
			document.addEventListener('click', handleClickOutside, true);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	useEffect(() => {
		if (selectKey === 'all' || selectKey === 'friendrequest') {
			getMyNotification();
		} else {
			getListUnRead();
		}
	}, [realTime, selectKey]);

	useEffect(() => {
		if (getNotifications.length > 0) {
			const filterFriend = getNotifications.filter(item => item.verb === 'addFriend' && !item.isCheck);
			if (filterFriend.length > 0) {
				setRenderFriend(true);
			}
		}
	}, [selectKey]);

	const getMyNotification = async () => {
		try {
			if (firstTimeOpenModal === false) {
				setIsLoading(true);
			}
			const notificationList = await dispatch(getNotification()).unwrap();
			const arrNew = notificationList.map(item => item.activities).flat(1);
			const newArr = arrNew.map(item => {
				const data = { ...item, isAccept: false, isRefuse: false };
				return { ...data };
			});
			const filterFriend = newArr.filter(item => !item.isCheck);
			setGetNotifications(filterFriend);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
			setFirstTimeOpenModal(true);
		}
	};

	const getListUnRead = async () => {
		let arrNew = [];
		try {
			setIsLoading(true);
			const notificationList = await dispatch(getListNotificationUnRead()).unwrap();
			arrNew = notificationList.map(item => item.activities).flat(1);
			const newArr = arrNew.map(item => {
				const data = { ...item, isAccept: false, isRefuse: false };
				return { ...data };
			});
			setGetListUnRead(newArr);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const lengthAddFriend = () => {
		const length = getNotifications.filter(item => item.verb === 'addFriend' && !item.isCheck);
		return length.length;
	};

	const handleNotification = () => {
		dispatch(backgroundToggle(true));
		setModalNoti(false);
		dispatch(activeKeyTabsNotification(selectKey));
	};

	console.log('modal', getNotifications);

	return (
		<div className='notification' ref={notifymodal}>
			<div className='notification__container'>
				<div className='notification__title'>Thông báo</div>
				{isLoading ? (
					<div className='notification__loading__container'>
						<LoadingTimeLine />
					</div>
				) : (
					<div className='notification__tabs'>
						<Tabs
							onSelect={eventKey => setSelectKey(eventKey)}
							defaultActiveKey='all'
							activeKey={selectKey}
						>
							<Tab eventKey='all' title='Tất cả'>
								<div className='notification__all-wrapper'>
									<div className='notification__all__title'>Mới nhất</div>
									{getNotifications
										.slice(0, 1)
										.map(
											item =>
												!item.isCheck && (
													<ModalItem
														key={item.id}
														item={item}
														setModalNoti={setModalNoti}
														selectKey={selectKey}
														setGetNotifications={setGetNotifications}
														getNotifications={getNotifications}
													/>
												)
										)}
									<div className='notification__all__title'>Gần đây</div>
									{getNotifications
										.slice(1, 6)
										.map(
											item =>
												!item.isCheck && (
													<ModalItem
														key={item.id}
														item={item}
														setModalNoti={setModalNoti}
														selectKey={selectKey}
														setGetNotifications={setGetNotifications}
														getNotifications={getNotifications}
													/>
												)
										)}
									<Link
										to={`/notification`}
										onClick={handleNotification}
										className='notification__tabs__button'
									>
										Xem tất cả
									</Link>
								</div>
							</Tab>

							<Tab eventKey='unread' title='Chưa đọc'>
								{getListUnread.length > 0 ? (
									<>
										<div className='  notification-title'>Thông báo chưa đọc</div>
										{getListUnread
											.slice(0, 4)
											.map(
												item =>
													!item.isRead &&
													!item.isCheck && (
														<ModalItem
															key={item.id}
															item={item}
															setModalNoti={setModalNoti}
														/>
													)
											)}
										<Link
											to={`/notification`}
											onClick={handleNotification}
											className='notification__tabs__button'
										>
											Xem tất cả
										</Link>
									</>
								) : (
									<span className='no__notificaion'>Bạn không có thông báo nào</span>
								)}
							</Tab>

							<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
								{renderFriend ? (
									<>
										<div className='notification__all__title'>
											{lengthAddFriend()} lời mời kết bạn
										</div>
										{getNotifications.map(
											item =>
												item.verb === 'addFriend' &&
												!item.isCheck && (
													<ModalItem
														key={item.id}
														item={item}
														setModalNoti={setModalNoti}
														selectKey={selectKey}
														setGetNotifications={setGetNotifications}
														getNotifications={getNotifications}
													/>
												)
										)}
										<Link
											to={`/notification`}
											onClick={handleNotification}
											className='notification__tabs__button'
										>
											Xem tất cả
										</Link>
									</>
								) : (
									<span className='no__notificaion'>Bạn chưa có lời mời kết bạn nào</span>
								)}
							</Tab>
						</Tabs>
					</div>
				)}
			</div>
		</div>
	);
};
NotificationModal.propTypes = {
	setModalNoti: PropTypes.func,
	buttonModal: PropTypes.object,
	realTime: PropTypes.bool,
};
export default NotificationModal;
