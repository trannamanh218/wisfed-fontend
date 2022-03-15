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
			const arrNew = notificationList.results.map(item => item.activities).flat(1);
			setGetNotifications(arrNew);
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	useEffect(() => {
		getMyNotification();
	}, []);

	const renderMessage = item => {
		if (item !== 'follow:id' && item !== 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3') {
			const parseObject = JSON.parse(item);
			return (
				<>
					<span>
						{parseObject.fullName ? parseObject.fullName : parseObject.firstName + parseObject.lastName}
					</span>{' '}
					đã gửi lời mời kết bạn
				</>
			);
		}
	};

	const renderImg = item => {
		if (item !== 'follow:id' && item !== 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3') {
			const parseObject = JSON.parse(item);
			return parseObject.avatarImage;
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
							{getNotifications.map(item => (
								<div key={item.id} className='notificaiton__tabs__main__all'>
									<div className='notificaiton__all__main__layout'>
										<UserAvatar size='mm' source={renderImg(item.object)} />
										<div className='notificaiton__all__main__layout__status'>
											<div className='notificaiton__main__all__infor'>
												<p dangerouslySetInnerHTML={{ __html: item?.message }}></p>
												{item.verb === 'addfriend' && renderMessage(item.object)}
											</div>
											<div className='notificaiton__all__status'>{`${calculateDurationTime(
												item.time
											)}`}</div>
										</div>
										<div className='notificaiton__main__all__unseen'></div>
									</div>
									{item.verb === 'addfriend' && (
										<div className='notificaiton__main__all__friend'>
											<div className='notificaiton__main__all__accept'>Chấp nhận</div>
											<div className='notificaiton__main__all__refuse'>Từ chối</div>
										</div>
									)}
								</div>
							))}
						</Tab>
						<Tab eventKey='unread' title='Chưa đọc'>
							<div className='notificaiton__all__main__title'>Thông báo chưa đọc</div>
							{getNotifications.map(item => (
								<div key={item.id} className='notificaiton__tabs__main__all'>
									<div className='notificaiton__all__main__layout'>
										<UserAvatar size='mm' source={renderImg(item.object)} />
										<div className='notificaiton__all__main__layout__status'>
											<div className='notificaiton__main__all__infor'>
												<p dangerouslySetInnerHTML={{ __html: item?.message }}></p>
												{item.verb === 'addfriend' && renderMessage(item.object)}
											</div>
											<div className='notificaiton__all__status'>{`${calculateDurationTime(
												item.time
											)}`}</div>
										</div>
										<div className='notificaiton__main__all__unseen'></div>
									</div>
									{item.verb === 'addfriend' && (
										<div className='notificaiton__main__all__friend'>
											<div className='notificaiton__main__all__accept'>Chấp nhận</div>
											<div className='notificaiton__main__all__refuse'>Từ chối</div>
										</div>
									)}
								</div>
							))}
						</Tab>
						<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
							<div className='notificaiton__all__main__title'>lời kết bạn</div>
							{getNotifications.map(
								item =>
									item.verb === 'addfriend' && (
										<div key={item.id} className='notificaiton__tabs__main__all'>
											<div className='notificaiton__all__main__layout'>
												<UserAvatar size='mm' source={renderImg(item.object)} />
												<div className='notificaiton__all__main__layout__status'>
													<div className='notificaiton__main__all__infor'>
														{renderMessage(item.object)}
													</div>
													<div className='notificaiton__all__status'>{`${calculateDurationTime(
														item.time
													)}`}</div>
												</div>
												<div className='notificaiton__main__all__unseen'></div>
											</div>
											<div className='notificaiton__main__all__friend'>
												<div className='notificaiton__main__all__accept'>Chấp nhận</div>
												<div className='notificaiton__main__all__refuse'>Từ chối</div>
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
