import { CircleActionsAlertQuestion, SettingIcon } from 'components/svg';
import { useEffect, useState } from 'react';
import './group-sibar.scss';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { updateKey } from 'reducers/redux-utils/group';
import defaultAvatar from 'assets/images/avatar.jpeg';
import { Link } from 'react-router-dom';

const SidebarGroupLef = ({ handleChange, data, member, onClickSeeMore }) => {
	const [listFriend, setListFriend] = useState([]);
	const [listFolow, setListFolow] = useState([]);
	const [listAdmin, setListAdmin] = useState([]);
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);

	useEffect(() => {
		const newListFolow = member.filter(item => item.isFollowMe === true);
		setListFolow(newListFolow);
		const newListFriend = member.filter(item => item.relation === 'friend');
		setListFriend(newListFriend);
		const newListAdmin = member.filter(item => item.isAdmin === true);
		setListAdmin(newListAdmin);
	}, [member]);

	const { groupType, description } = data;
	return (
		<div className='group-sibar-left__container'>
			{listAdmin.some(item => item.id === userInfo.id) && (
				<div className='group__manager'>
					<h3 className='group-sibar-left__title'>Quản lý nhóm</h3>
					<div className='group-sibar-left__description'>
						<div style={{ display: 'none' }}>
							<div className='manage-item' onClick={() => handleChange('settingsQuestion')}>
								<span>
									<CircleActionsAlertQuestion /> Câu hỏi thành viên
								</span>
							</div>

							<span className='manage-item' onClick={() => handleChange('manageJoin')}>
								<p>99+</p> Yêu cầu làm thành viên
							</span>

							<span className='manage-item' onClick={() => handleChange('managePost')}>
								<p>99+</p> Bài viết đang chờ
							</span>
						</div>

						<div className='manage-btn' onClick={() => handleChange('settings')}>
							<SettingIcon /> Cài đặt
						</div>
					</div>
				</div>
			)}

			<div className='group__intro'>
				<h3 className='group-sibar-left__title'>Giới thiệu</h3>
				<div className='group-sibar-left__description'>
					{/* <span>
					<img src='' alt='' /> Nhóm kín
				</span> */}
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Kiểu nội dung: </strong>
							{groupType === 'book' ? 'Sách' : groupType === 'author' ? 'Tác giả' : 'Chia sẻ'}
						</span>
					</div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Giới thiệu: </strong> {description}
						</span>
					</div>
				</div>
			</div>

			<div className='group-sibar-left__btn'>
				<button onClick={onClickSeeMore}>Xem thêm</button>
			</div>

			<div>
				<h3 className='group-sibar-left__title under-title'>Thành viên</h3>
				<div className='group-sibar-left__people'>
					<div className='group-sibar-left__people-admin'>
						<b>Quản trị viên</b>
						{member?.map((item, index) => {
							return (
								<div key={index}>
									{item?.isAdmin && (
										<div className='people-item'>
											<Link to={`/profile/${item.id}`}>
												<img
													src={item.avatarImage ? item.avatarImage : defaultAvatar}
													onError={e => e.target.setAttribute('src', defaultAvatar)}
													alt=''
												/>
											</Link>
											<div className='people-item__text'>
												<Link to={`/profile/${item.id}`}>
													<span>{item.fullName || item.firstName + ' ' + item.lastName}</span>
												</Link>
												{item.mutualFriend ? (
													<div>
														{item.mutualFriend < 10
															? `0${item.mutualFriend} `
															: `${item.mutualFriend} `}
														bạn chung
													</div>
												) : (
													''
												)}
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
					{listFriend.length > 0 ? (
						<div className='group-sibar-left__people-friends'>
							<b>Bạn bè</b>
							<div style={{ marginTop: '10px' }}>
								{listFriend.map((item, index) => {
									return (
										<div key={index}>
											<div className='people-item'>
												<Link to={`/profile/${item.id}`}>
													<img
														src={item.avatarImage ? item.avatarImage : defaultAvatar}
														onError={e => e.target.setAttribute('src', defaultAvatar)}
														alt=''
													/>
												</Link>
												<div className='people-item__text'>
													<Link to={`/profile/${item.id}`}>
														<span>
															{item.fullName || item.firstName + ' ' + item.lastName}
														</span>
													</Link>
													{item.mutualFriend ? (
														<div>
															{item.mutualFriend < 10
																? `0${item.mutualFriend} `
																: `${item.mutualFriend} `}
															bạn chung
														</div>
													) : (
														''
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						''
					)}
					{listFolow.length > 0 ? (
						<div className='group-sibar-left__people-friends'>
							<b>Người theo dõi</b>
							<div style={{ marginTop: '10px' }}>
								{listFolow.map((item, index) => {
									return (
										<div className='people-item' key={index}>
											<Link to={`/profile/${item.id}`}>
												<img
													src={item.avatarImage ? item.avatarImage : defaultAvatar}
													onError={e => e.target.setAttribute('src', defaultAvatar)}
													alt=''
												/>
											</Link>
											<div className='people-item__text'>
												<Link to={`/profile/${item.id}`}>
													<span>{item.fullName || item.firstName + ' ' + item.lastName}</span>
												</Link>
												{item.mutualFriend ? (
													<div>
														{item.mutualFriend < 10
															? `0${item.mutualFriend} `
															: `${item.mutualFriend} `}
														bạn chung
													</div>
												) : (
													''
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						''
					)}
				</div>
			</div>
			<div className='group-sibar-left__btn'>
				<button onClick={() => dispatch(updateKey('member'))}>Xem tất cả</button>
			</div>
		</div>
	);
};

SidebarGroupLef.propTypes = {
	handleChange: PropTypes.func,
	data: PropTypes.object,
	member: PropTypes.any,
};

export default SidebarGroupLef;
