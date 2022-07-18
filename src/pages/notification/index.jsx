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
} from 'reducers/redux-utils/notificaiton';
import { getNotification } from 'reducers/redux-utils/notificaiton';
import { NotificationError } from 'helpers/Error';
import { useSelector } from 'react-redux';
import LoadingTimeLine from './loading-timeline';
import ModalItem from './modal-item';
import { renderMessage } from 'helpers/HandleShare';
import LoadingIndicator from 'shared/loading-indicator';
import { readNotification } from 'reducers/redux-utils/notificaiton';

const NotificationModal = ({ setModalNotti, buttonModal, realTime }) => {
	const notifymodal = useRef(null);
	const [selectKey, setSelectKey] = useState('all');
	const [isLoading, setIsLoading] = useState(null);
	const [renderFriend, setRenderFriend] = useState(false);
	const [getNotifications, setGetNotifications] = useState([]);
	const [getListUnread, setGetListUnRead] = useState([]);
	const { listNotifcaiton, listUnRead } = useSelector(state => state.notificationReducer);

	const dispatch = useDispatch();

	const handleClickOutside = e => {
		if (notifymodal.current && !notifymodal.current.contains(e.target) && !buttonModal.current.contains(e.target)) {
			setModalNotti(false);
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
	}, []);

	const getMyNotification = async () => {
		try {
			setIsLoading(true);
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
			// dispatch(handleListUnRead(newArr));
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

	const handleNotificaiton = () => {
		dispatch(backgroundToggle(true));
		setModalNotti(false);
		dispatch(activeKeyTabsNotification(selectKey));
	};

	return (
		<div className='notificaiton'>
			<div ref={notifymodal} className='notificaiton__container'>
				<div className='notificaiton__title'>Thông báo</div>
				{isLoading ? (
					<div className='notificaiton__loading__container'>
						<LoadingTimeLine />
					</div>
				) : (
					<div className='notificaiton__tabs'>
						<Tabs
							onSelect={eventKey => setSelectKey(eventKey)}
							defaultActiveKey='all'
							activeKey={selectKey}
						>
							<Tab eventKey='all' title='Tất cả'>
								<div className='notificaiton__all__title'>Mới nhất</div>
								{getNotifications
									.slice(0, 1)
									.map(
										item =>
											!item.isCheck && (
												<ModalItem
													key={item.id}
													item={item}
													setModalNotti={setModalNotti}
													selectKey={selectKey}
													setGetNotifications={setGetNotifications}
													getNotifications={getNotifications}
												/>
											)
									)}
								<div className='notificaiton__all__title'>Gần đây</div>
								{getNotifications
									.slice(1, 5)
									.map(
										item =>
											!item.isCheck && (
												<ModalItem
													key={item.id}
													item={item}
													setModalNotti={setModalNotti}
													selectKey={selectKey}
													setGetNotifications={setGetNotifications}
													getNotifications={getNotifications}
												/>
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
								{getListUnread.length > 0 ? (
									<>
										<div className='notificaiton__all__title'>Thông báo chưa đọc</div>
										{getListUnread
											.slice(0, 6)
											.map(
												item =>
													!item.isRead &&
													!item.isCheck && (
														<ModalItem
															key={item.id}
															item={item}
															setModalNotti={setModalNotti}
														/>
													)
											)}
										<Link
											to={`/notification`}
											onClick={handleNotificaiton}
											className='notificaiton__tabs__button'
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
										{' '}
										<div className='notificaiton__all__title'>{lengthAddFriend()} lời kết bạn</div>
										{getNotifications.map(
											item =>
												item.verb === 'addFriend' &&
												!item.isCheck && (
													<ModalItem
														key={item.id}
														item={item}
														setModalNotti={setModalNotti}
														selectKey={selectKey}
														setGetNotifications={setGetNotifications}
														getNotifications={getNotifications}
													/>
												)
										)}
										<Link
											to={`/notification`}
											onClick={handleNotificaiton}
											className='notificaiton__tabs__button'
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
	setModalNotti: PropTypes.func,
	buttonModal: PropTypes.object,
	realTime: PropTypes.bool,
};
export default NotificationModal;
