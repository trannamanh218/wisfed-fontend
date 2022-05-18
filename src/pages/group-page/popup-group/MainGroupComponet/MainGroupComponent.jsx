import React, { useState, useEffect } from 'react';
import SearchField from 'shared/search-field';
// import classNames from 'classnames';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import IntroGroup from './component/introGroup';
import MainPostGroup from './component/MainPostGroup';
import MemberGroup from './component/MemberGroup';
import './style.scss';
import { ActionPlusGroup, CloseIconX, DropdownGroup, IconCheck, LogInCircle, LogOutGroup } from 'components/svg';
import SettingsGroup from './AminSettings/SettingsGroup';
import SettingsQuestions from './AminSettings/SettingsQuestions';
import ManageJoin from './AminSettings/ManageJoin';
import PropTypes from 'prop-types';
import PostWatting from './AminSettings/PostWatting';
import PopupInviteFriend from '../popupInviteFriend';
import { getEnjoyGroup } from 'reducers/redux-utils/group';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

function MainGroupComponent({ handleChange, keyChange, data, backgroundImage }) {
	const [key, setKey] = useState('intro');
	const { groupType, description, memberGroups, name } = data;
	const [isShow, setIsShow] = useState(false);
	const { id = '' } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const { userInfo } = useSelector(state => state.auth);
	const [showSelect, setShowSelect] = useState(false);

	const enjoyGroup = async () => {
		try {
			await dispatch(getEnjoyGroup(id));
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		const checkItem = data?.memberGroups?.filter(item => item?.user?.id === userInfo?.id);
		if (checkItem?.length > 0) {
			setShow(true);
		}
	}, [data, userInfo, enjoyGroup.show]);

	return (
		<div className='group-main-component__container'>
			<div className='group__background'>
				<div>
					<img
						src={
							backgroundImage !== undefined
								? backgroundImage
								: 'https://img4.thuthuatphanmem.vn/uploads/2020/08/28/anh-bia-dep-danh-cho-zalo_093733432.jpg'
						}
						alt=''
					/>
				</div>
				<div className='group__title-name'>
					<span>Nhóm của Shadow</span>
				</div>
			</div>
			<div className='group-name'>
				<div className='group-name__content'>
					<h2>{name}</h2>
					<div className='group-name__member'>
						<span>
							{memberGroups?.length < 10 ? `0${memberGroups?.length}` : memberGroups?.length} thành viên
						</span>
					</div>
				</div>
				<div className='group-name__btn'>
					<div className='btn-top'>
						{show ? (
							<>
								<div className='group-name__joined-group'>
									<button onClick={() => setShowSelect(!showSelect)}>
										<IconCheck />
										<span>Đã tham gia</span>
										<DropdownGroup />
									</button>
									<div className='list__dropdown' style={!showSelect ? { display: 'none' } : {}}>
										<ul>
											<li>
												<CloseIconX /> Bỏ theo dõi
											</li>
											<li>
												<LogOutGroup /> Rời khỏi nhóm
											</li>
										</ul>
									</div>
								</div>
							</>
						) : (
							<div className='group-name__join-group'>
								<button onClick={() => enjoyGroup()}>
									<LogInCircle />
									Yêu cầu tham gia
								</button>
							</div>
						)}

						<div className='group-name__invite-group' onClick={() => setIsShow(!isShow)}>
							<button>
								<ActionPlusGroup />
								Mời
							</button>
						</div>
					</div>
					<div style={{ position: 'fixed', left: '33%', top: '20%', zIndex: '1000' }}>
						{isShow ? (
							<div className='popup-container'>
								<PopupInviteFriend handleClose={() => setIsShow(!isShow)} />
							</div>
						) : (
							''
						)}
					</div>

					<div className='group__search'>
						<SearchField placeholder='Tìm kiếm sách, chủ để, hashtag ...' />
					</div>
				</div>
			</div>
			{keyChange === 'tabs' && (
				<div className='group-tabs'>
					<Tabs id='controlled-tab' activeKey={key} onSelect={k => setKey(k)} className='mb-3'>
						<Tab eventKey='intro' title='Giới thiệu'>
							<IntroGroup
								groupType={groupType}
								description={description}
								memberGroups={memberGroups}
								createdAt={data?.createdAt}
							/>
						</Tab>
						<Tab eventKey='post' title='Bài viết'>
							<MainPostGroup />
						</Tab>
						<Tab eventKey='member' title='Thành viên'>
							<MemberGroup memberGroups={memberGroups} />
						</Tab>
					</Tabs>
				</div>
			)}
			{keyChange === 'settings' && <SettingsGroup handleChange={handleChange} />}
			{keyChange === 'settingsQuestion' && <SettingsQuestions handleChange={handleChange} />}
			{keyChange === 'manageJoin' && <ManageJoin handleChange={handleChange} />}
			{keyChange === 'managePost' && <PostWatting handleChange={handleChange} />}
		</div>
	);
}

MainGroupComponent.propTypes = {
	handleChange: PropTypes.func,
	keyChange: PropTypes.string,
	data: PropTypes.object,
	backgroundImage: PropTypes.string,
};

export default MainGroupComponent;
