import { CircleActionsAlertQuestion, SettingIcon } from 'components/svg';
import { useEffect, useState } from 'react';
import './group-sibar.scss';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { updateKey } from 'reducers/redux-utils/group';
import defaultAvatar from 'assets/images/avatar.jpeg';

const SidebarGroupLef = ({ handleChange, data, member }) => {
	const [listFriend, setListFriend] = useState([]);
	const [listFolow, setListFolow] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		const newListFolow = member.filter(item => item.isFollowMe === true);
		setListFolow(newListFolow);
		const newListFriend = member.filter(item => item.relation === 'friend');
		setListFriend(newListFriend);
	}, [member]);

	const { groupType, description } = data;
	return (
		<div className='group-sibar-left__container'>
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
			<div className='group__intro'>
				<h3 className='group-sibar-left__title'>Giới thiệu</h3>
				<div className='group-sibar-left__description'>
					{/* <span>
					<img src='' alt='' /> Nhóm kín
				</span> */}
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Kiểu nội dung:</strong> {groupType}
						</span>
					</div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Giới thiệu:</strong> {description}
						</span>
					</div>
				</div>
			</div>

			<div className='group-sibar-left__btn'>
				<button onClick={() => dispatch(updateKey('intro'))}>Xem thêm</button>
			</div>

			<div>
				<h3 className='group-sibar-left__title under-title'>Thành viên</h3>
				<div className='group-sibar-left__people'>
					<div className='group-sibar-left__people-admin'>
						<span>Quản trị viên</span>
						{member?.map((item, index) => {
							return (
								<div key={index}>
									{item?.isAdmin && (
										<div className='people-item'>
											<img
												src={item.avatarImage ? item.avatarImage : defaultAvatar}
												onError={e => e.target.setAttribute('src', defaultAvatar)}
												alt=''
											/>
											<div className='people-item__text'>
												<span>{item.fullName || item.firstName + ' ' + item.lastName}</span>
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
					<div className='group-sibar-left__people-friends'>
						<span>Bạn bè</span>
						<div style={{ marginTop: '10px' }}>
							{listFriend.length > 0
								? listFriend.map((item, index) => {
										return (
											<div key={index}>
												<div className='people-item'>
													<img
														src={item.avatarImage ? item.avatarImage : defaultAvatar}
														onError={e => e.target.setAttribute('src', defaultAvatar)}
														alt=''
													/>
													<div className='people-item__text'>
														<span>
															{item.fullName || item.firstName + ' ' + item.lastName}
														</span>
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
								  })
								: 'Không có dữ liệu'}
						</div>
					</div>
					<div className='group-sibar-left__people-friends'>
						<span>Người theo dõi</span>
						<div style={{ marginTop: '10px' }}>
							{listFolow.length > 0
								? listFolow.map((item, index) => {
										return (
											<div className='people-item' key={index}>
												<img
													src={item.avatarImage ? item.avatarImage : defaultAvatar}
													onError={e => e.target.setAttribute('src', defaultAvatar)}
													alt=''
												/>
												<div className='people-item__text'>
													<span>{item.fullName || item.firstName + ' ' + item.lastName}</span>
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
								  })
								: 'Không có dữ liệu'}
						</div>
					</div>
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
