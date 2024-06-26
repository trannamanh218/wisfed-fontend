import { useState, useEffect, useCallback } from 'react';
import SearchField from 'shared/search-field';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import IntroGroup from './component/introGroup';
import MainPostGroup from './component/MainPostGroup';
import MemberGroup from './component/MemberGroup';
import './style.scss';
import {
	ActionPlusGroup,
	CloseIconX,
	DropdownGroup,
	IconCheck,
	LogInCircle,
	LogOutGroup,
	WorldNet,
} from 'components/svg';
import SettingsGroup from './AminSettings/SettingsGroup';
// import SettingsQuestions from './AminSettings/SettingsQuestions'; // k xóa
// import ManageJoin from './AminSettings/ManageJoin'; // k xóa
import PropTypes from 'prop-types';
// import PostWatting from './AminSettings/PostWatting'; // k xóa
import PopupInviteFriend from '../popupInviteFriend';
import {
	getEnjoyGroup,
	getupdateBackground,
	getFillterGroup,
	leaveGroupUser,
	unFollowGroupUser,
	followGroupUser,
	updateKey,
	checkIsJoinedGroup,
} from 'reducers/redux-utils/group';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Circle from 'shared/loading/circle';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import SearchLayout from './component/SearchLayout';
import { useVisible } from 'shared/hooks';
import defaultAvatar from 'assets/images/Rectangle 17435.png';
import Dropzone from 'react-dropzone';
import { uploadImage } from 'reducers/redux-utils/common';
import camera from 'assets/images/camera.png';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import LoadingIndicator from 'shared/loading-indicator';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';

function MainGroupComponent({
	handleChange,
	keyChange,
	data,
	member,
	handleUpdate,
	fetchData,
	eventKey,
	setEventKey,
	toggleClickSeeMore,
	setToggleClickSeeMore,
	isFetching,
	setIsFetching,
}) {
	const [valueGroupSearch, setValueGroupSearch] = useState('');
	const [filter, setFilter] = useState('[]');
	const [getData, setGetData] = useState({});
	const [toggleFollowGroup, setToggleFollowGroup] = useState(false);
	const [showSelect, setShowSelect] = useState(false);
	const [isFetchingSearchInFroup, setIsFetchingSearchInGroup] = useState(false);
	const [show, setShow] = useState(false);

	const { id } = useParams();
	const dispatch = useDispatch();

	const joinedGroupPopup = useRef(null);

	const { groupType, description, memberGroups, name } = data;
	const { userInfo } = useSelector(state => state.auth);
	const keyRedux = useSelector(state => state.group.key);
	const { ref: showRef, isVisible: isShow, setIsVisible: setIsShow } = useVisible(false);

	useEffect(() => {
		function handleClickOutside(event) {
			if (joinedGroupPopup.current && !joinedGroupPopup.current.contains(event.target)) {
				setShowSelect(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const enjoyGroup = async () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			setIsFetching(true);
			try {
				await dispatch(getEnjoyGroup(data?.id)).unwrap();
				dispatch(checkIsJoinedGroup(true));
				setShow(true);
				setIsFetching(false);
			} catch (err) {
				NotificationError(err);
			} finally {
				setIsFetching(false);
			}
		}
	};

	const leaveGroup = async () => {
		const params = {
			id: data?.id,
		};
		try {
			await dispatch(leaveGroupUser(params)).unwrap();
			setShow(false);
			setShowSelect(false);
			dispatch(checkIsJoinedGroup(false));
		} catch (err) {
			setShowSelect(false);
			if (err.errorCode === 760) {
				const customId = 'custom-id-PersonalInfo-handleDrop-warning';
				toast.warning('Bạn đang là Admin bạn không thể rời nhóm', { toastId: customId });
			}
		}
	};

	const unFollowGroup = async () => {
		setToggleFollowGroup(true);
		setIsFetching(true);
		try {
			await dispatch(unFollowGroupUser(data?.id)).unwrap();
			setShowSelect(false);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	const handleFollowGroup = async () => {
		setToggleFollowGroup(false);
		setIsFetching(true);
		try {
			await dispatch(followGroupUser(data?.id)).unwrap();
			setShowSelect(false);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	const handleChangeSearch = e => {
		setValueGroupSearch(e.target.value);
		if (e.target.value !== '') {
			debounceSearch(e.target.value);
			handleChange('search');
		} else {
			handleChange('tabs');
			setGetData({});
			setFilter('[]');
		}
	};

	const updateInputSearch = value => {
		const filterValue = value.toLowerCase().trim();
		setFilter(filterValue);
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	useEffect(async () => {
		setIsFetchingSearchInGroup(true);
		try {
			if (valueGroupSearch.length > 0) {
				const params = {
					q: filter,
					id: id,
					limit: 50,
				};
				const result = await dispatch(getFillterGroup({ ...params })).unwrap();
				setGetData(result);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetchingSearchInGroup(false);
		}
	}, [filter]);

	const handleUpload = useCallback(async acceptedFiles => {
		if (!_.isEmpty(acceptedFiles)) {
			try {
				const imageUploadedData = await dispatch(uploadImage(acceptedFiles)).unwrap();
				const params = {
					id: id,
					param: {
						avatar: imageUploadedData.streamPath.default,
					},
				};
				dispatch(getupdateBackground(params));
				handleUpdate();
				const customId = 'custom-id-handleUpdateGroupBackgroundImg';
				toast.success('Cập nhật ảnh bìa thành công', {
					toastId: customId,
				});
			} catch (error) {
				if (error.statusCode === 413) {
					const customId = 'custom-id-PersonalInfo-handleDrop-warning';
					toast.warning('Không cập nhật được ảnh quá 1Mb', { toastId: customId });
				} else {
					const customId = 'custom-id-PersonalInfo-handleDrop-error';
					toast.error('Cập nhật ảnh thất bại', { toastId: customId });
				}
			}
		}
	});

	const handleSelect = () => {
		setEventKey(keyRedux);
	};

	useEffect(() => {
		handleSelect();
	}, [keyRedux]);

	useEffect(() => {
		if (!_.isEmpty(data) && !_.isEmpty(userInfo)) {
			const checkIsGroupMember = data?.memberGroups?.some(item => item?.userId === userInfo?.id);
			if (checkIsGroupMember) {
				setEventKey('post');
				setShow(true);
			}
		}
	}, [data, userInfo]);

	const handleChangeGroupImage = imgFile => {
		if (imgFile.length) {
			handleUpload(imgFile);
		} else {
			const customId = 'main-group-upload-bg-img';
			toast.warning('Chỉ được chọn ảnh PNG, JPG, JPEG và không được quá 3MB', { toastId: customId });
		}
	};

	return (
		<div className='group-main-component__container'>
			<Circle loading={isFetching} />
			<div className='group__background'>
				<img
					src={data.avatar ? data.avatar : defaultAvatar}
					onError={e => e.target.setAttribute('src', defaultAvatar)}
					alt='image'
				/>

				{/* Chỉ quản trị viên mới có thể thay đổi ảnh bìa */}
				{data.createdBy?.id === userInfo.id && (
					<Dropzone
						onDrop={acceptedFiles => handleChangeGroupImage(acceptedFiles)}
						multiple={false}
						accept={['.png', '.jpeg', '.jpg']}
						maxSize={3000000}
					>
						{({ getRootProps, getInputProps }) => (
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<div className='dropzone upload-image'>
									<img src={camera} alt='camera' />
									<span style={{ marginRight: '3px' }}>Chỉnh sửa ảnh bìa</span>
								</div>
							</div>
						)}
					</Dropzone>
				)}

				<div className='group__title-name'>
					<span>
						Nhóm của{' '}
						{data?.createdBy?.fullName || data?.createdBy?.firstName + ' ' + data?.createdBy?.lastName}
					</span>
				</div>
			</div>
			<div className='group-name'>
				<div className='group-name__content'>
					<h2>{name}</h2>
					<div className='group-name__member'>
						{data.isPublic && (
							<div className='groupPublic'>
								<WorldNet />
								<span>Nhóm công khai</span>
								<div className='imgPani'>
									<div className='post__user-status__post-time-status__online-dot'></div>
								</div>
							</div>
						)}

						<span>
							{memberGroups?.length < 10 ? `0${memberGroups?.length}` : memberGroups?.length} thành viên
						</span>
					</div>
				</div>
				<div className='group-name__btn'>
					<div className='btn-top'>
						{show ? (
							<>
								<div ref={joinedGroupPopup} className='group-name__joined-group'>
									<button onClick={() => setShowSelect(!showSelect)}>
										<IconCheck />
										<span>Đã tham gia</span>
										<DropdownGroup />
									</button>
									<div className='list__dropdown' style={!showSelect ? { display: 'none' } : {}}>
										<ul>
											{toggleFollowGroup ? (
												<li onClick={() => handleFollowGroup()}>
													<CloseIconX /> Theo dõi
												</li>
											) : (
												<li onClick={() => unFollowGroup()}>
													<CloseIconX /> Bỏ theo dõi
												</li>
											)}
											<li onClick={() => leaveGroup()}>
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
						<div
							className='group-name__invite-group'
							onClick={() => {
								if (!Storage.getAccessToken()) {
									dispatch(checkUserLogin(true));
								} else {
									setIsShow(!isShow);
								}
							}}
						>
							<button>
								<ActionPlusGroup />
								Mời
							</button>
						</div>
					</div>

					<div className='modal-popup-container'>
						{isShow ? (
							<div className='popup-container'>
								<PopupInviteFriend
									handleClose={() => setIsShow(!isShow)}
									showRef={showRef}
									groupMembers={member}
								/>
							</div>
						) : (
							''
						)}
					</div>

					<div className='group__search'>
						<SearchField
							handleChange={handleChangeSearch}
							value={valueGroupSearch}
							placeholder='Tìm kiếm sách, chủ để, hashtag ...'
						/>
					</div>
				</div>
			</div>
			{keyChange === 'tabs' && (
				<div className='group-tabs'>
					<Tabs
						id='controlled-tab'
						activeKey={eventKey}
						onSelect={k => {
							setEventKey(k);
							dispatch(updateKey(k));
						}}
						className='mb-3'
					>
						<Tab eventKey='intro' title='Giới thiệu'>
							<IntroGroup
								data={data}
								groupType={groupType}
								description={description}
								createdAt={data.createdAt}
								toggleClickSeeMore={toggleClickSeeMore}
								setToggleClickSeeMore={setToggleClickSeeMore}
							/>
						</Tab>
						<Tab eventKey='post' title='Bài viết'>
							<MainPostGroup handleUpdate={handleUpdate} show={show} />
						</Tab>
						<Tab eventKey='member' title='Thành viên'>
							<MemberGroup memberGroupsProp={member} />
						</Tab>
					</Tabs>
				</div>
			)}
			{keyChange === 'settings' && (
				<SettingsGroup handleChange={handleChange} data={data} fetchData={fetchData} />
			)}
			{/* {keyChange === 'settingsQuestion' && <SettingsQuestions handleChange={handleChange} />} */}
			{/* {keyChange === 'manageJoin' && <ManageJoin handleChange={handleChange} />} */}
			{/* {keyChange === 'managePost' && <PostWatting handleChange={handleChange} />} */}
			{keyChange === 'search' && (
				<div style={{ marginTop: '20px' }}>
					{!isFetchingSearchInFroup && !_.isEmpty(getData) ? (
						<SearchLayout
							dataGroup={getData}
							filter={filter}
							valueGroupSearch={valueGroupSearch}
							show={show}
							id={id}
						/>
					) : (
						<LoadingIndicator />
					)}
				</div>
			)}
		</div>
	);
}

MainGroupComponent.propTypes = {
	handleChange: PropTypes.func,
	keyChange: PropTypes.string,
	data: PropTypes.object,
	backgroundImage: PropTypes.string,
	member: PropTypes.array,
	handleUpdate: PropTypes.func,
	fetchData: PropTypes.func,
	eventKey: PropTypes.string,
	setEventKey: PropTypes.func,
	toggleClickSeeMore: PropTypes.bool,
	setToggleClickSeeMore: PropTypes.func,
	isFetching: PropTypes.bool,
	setIsFetching: PropTypes.func,
};

export default MainGroupComponent;
