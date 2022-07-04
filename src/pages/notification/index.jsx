import './modal-notification.scss';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { backgroundToggle, activeKeyTabsNotification, handleListNotification } from 'reducers/redux-utils/notificaiton';
import { getNotification } from 'reducers/redux-utils/notificaiton';
import { NotificationError } from 'helpers/Error';
import { useSelector } from 'react-redux';
import LoadingTimeLine from './loading-timeline';
import ModalItem from './modal-item';

const NotificationModal = ({ setModalNotti, buttonModal, realTime }) => {
	const notifymodal = useRef(null);
	const [selectKey, setSelectKey] = useState('all');
	const [isLoading, setIsLoading] = useState(true);
	const [renderFriend, setRenderFriend] = useState(true);
	const [renderRead, setRenderRead] = useState(false);
	const [getNotifications, setGetNotifications] = useState([]);
	const { listNotifcaiton } = useSelector(state => state.notificationReducer);
	const dispatch = useDispatch();

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

	useEffect(() => {
		getMyNotification();
	}, [realTime]);

	useEffect(() => {
		if (getNotifications.length > 0) {
			const filterFriend = getNotifications.filter(item => item.verb === 'addFriend' && !item.isCheck);
			const filterRead = getNotifications.filter(item => !item.isCheck && !item.isRead);
			if (filterFriend) {
				setRenderFriend(false);
			}
			if (filterRead) {
				setRenderRead(true);
			}
		}
	}, [getNotifications]);

	const getMyNotification = async () => {
		let arrNew = [];
		try {
			if (listNotifcaiton.length > 0 && !realTime) {
				setGetNotifications(listNotifcaiton.slice(0, 10));
			} else {
				const notificationList = await dispatch(getNotification()).unwrap();
				arrNew = notificationList.map(item => item.activities).flat(1);
				const newArr = arrNew.map(item => {
					const data = { ...item, isAccept: false, isRefuse: false };
					return { ...data };
				});
				dispatch(handleListNotification(newArr));
				setGetNotifications(newArr.slice(0, 10));
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const lengthAddFriend = () => {
		const length = getNotifications.filter(
			item => (item.verb === 'addFriend' || item.verb === 'addfriend') && !item.isCheck
		);
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
						<Tabs onSelect={eventKey => setSelectKey(eventKey)} defaultActiveKey='all'>
							<Tab eventKey='all' title='Tất cả'>
								<div className='notificaiton__all__title'>Mới nhất</div>
								{getNotifications
									.slice(0, 1)
									.map(
										item => !item.isCheck && <ModalItem item={item} setModalNotti={setModalNotti} />
									)}
								<div className='notificaiton__all__title'>Gần đây</div>
								{getNotifications
									.slice(1, 5)
									.map(
										item => !item.isCheck && <ModalItem item={item} setModalNotti={setModalNotti} />
									)}
								<Link
									to={`/notification`}
									onClick={handleNotificaiton}
									className='notificaiton__tabs__button'
								>
									Xem tất cả
								</Link>
							</Tab>
							{renderRead && (
								<Tab eventKey='unread' title='Chưa đọc'>
									<div className='notificaiton__all__title'>Thông báo chưa đọc</div>
									{getNotifications
										.slice(0, 6)
										.map(
											item =>
												!item.isCheck &&
												!item.isRead && <ModalItem item={item} setModalNotti={setModalNotti} />
										)}
									<Link
										to={`/notification`}
										onClick={handleNotificaiton}
										className='notificaiton__tabs__button'
									>
										Xem tất cả
									</Link>
								</Tab>
							)}
							{renderFriend && (
								<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
									<div className='notificaiton__all__title'>{lengthAddFriend()} lời kết bạn</div>
									{getNotifications.map(
										item =>
											item.verb === 'addFriend' &&
											!item.isCheck && <ModalItem item={item} setModalNotti={setModalNotti} />
									)}
									<Link
										to={`/notification`}
										onClick={handleNotificaiton}
										className='notificaiton__tabs__button'
									>
										Xem tất cả
									</Link>
								</Tab>
							)}
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
