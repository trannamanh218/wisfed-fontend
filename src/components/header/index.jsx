import { useEffect, useState, useRef, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	LogoFull,
	BookFillIcon,
	BookIcon,
	CategoryIcon,
	GroupIcon,
	HomeIcon,
	LogOutIcon,
	ProfileIcon,
	GroupFillIcon,
	FriendsFillIcon,
	FriendsIcon,
	CategoryFillIcon,
	LogoNonText,
	Bell,
} from 'components/svg';
import SearchIcon from 'assets/icons/search.svg';
import classNames from 'classnames';
import './header.scss';
import NotificationModal from 'pages/notification/notification-modal';
import { useDispatch, useSelector } from 'react-redux';
import { backgroundToggle, handleUpdateNewNotification, patchNewNotification } from 'reducers/redux-utils/notification';
import { checkUserLogin, deleteUserInfo, updateUserInfo } from 'reducers/redux-utils/auth';
import { useVisible } from 'shared/hooks';
import SearchAllModal from 'shared/search-all';
import Storage from 'helpers/Storage';
import {
	handleResetValue,
	handleUpdateValueInputSearchRedux,
	handleUpdateWentInResult,
} from 'reducers/redux-utils/search';
import { toast } from 'react-toastify';
import { updateTargetReading } from 'reducers/redux-utils/chart';
import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';
import * as stream from 'getstream';
import _ from 'lodash';
import { handleRefreshNewfeed } from 'reducers/redux-utils/activity';
import Request from 'helpers/Request';
import HeaderSearchMobile from './header-search-mobile';
import { NotificationError } from 'helpers/Error';
import { hashtagRegex } from 'constants';

const Header = () => {
	const { valueInputSearchRedux } = useSelector(state => state.search);
	const { isShowModal } = useSelector(state => state.search);
	const { userInfo } = useSelector(state => state.auth);
	const isNewNotificationByRealtime = useSelector(state => state.notificationReducer.isNewNotificationByRealtime);
	const { wentInResult } = useSelector(state => state.search);

	const { ref: showRef, isVisible: isShow, setIsVisible: setIsShow } = useVisible(false);
	const {
		ref: searchMobileWrapper,
		isVisible: isShowSearchMobile,
		setIsVisible: setIsShowSearchMobile,
	} = useVisible(false);

	const [activeLink, setActiveLink] = useState('/');
	const [modalNoti, setModalNoti] = useState(false);
	const [modalInforUser, setModalInforUser] = useState(false);
	const [getSlugResult, setGetSlugResult] = useState('');
	const [showNavIcon, setShowNavIcon] = useState(true);
	const [notiPopover, setNotiPopover] = useState(true);

	const buttonModal = useRef(null);
	const userOptions = useRef(null);

	const navigate = useNavigate();
	const location = useLocation();
	const { pathname } = location;

	const dispatch = useDispatch();

	useEffect(() => {
		if (userOptions.current) {
			document.addEventListener('click', closeUserOptions);
		}
		return () => {
			document.removeEventListener('click', closeUserOptions);
		};
	}, []);

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			if (pathname === '/notification') {
				dispatch(handleUpdateNewNotification(false));
			} else {
				dispatch(handleUpdateNewNotification(userInfo.isNewNotification));
			}

			if (userInfo.userToken) {
				// bắt sự kiện khi có thông báo getStream trả về theo thời gian thực
				const client = stream.connect('wmtg4f3vuuyh', null, '1196914');
				const notificationFeed = client.feed('notification', userInfo.id, userInfo.userToken);
				const callback = () => {
					dispatch(handleUpdateNewNotification(true));
				};
				notificationFeed.subscribe(callback);
			}
		}
	}, [userInfo]);

	useEffect(() => {
		setActiveLink(pathname);
		if (pathname === '/notification') {
			try {
				dispatch(patchNewNotification({ isNewNotification: false })).unwrap();
				dispatch(handleUpdateNewNotification(false));
				dispatch(updateUserInfo({ ...userInfo, isNewNotification: false }));
			} catch (err) {
				NotificationError(err);
			}
		}
	}, [pathname]);

	useEffect(() => {
		if (isShowModal) {
			dispatch(handleResetValue(false));
			setIsShow(false);
		}
	}, [isShowModal]);

	useEffect(() => {
		let timeout;
		if (!isShowSearchMobile) {
			timeout = setTimeout(() => {
				setShowNavIcon(true);
			}, 400);
		} else {
			setShowNavIcon(false);
		}
		return () => {
			clearTimeout(timeout);
		};
	}, [isShowSearchMobile]);

	const closeUserOptions = e => {
		if (userOptions.current && !userOptions.current.contains(e.target)) {
			setModalInforUser(false);
		}
	};

	const toglleModalNotify = () => {
		if (isNewNotificationByRealtime) {
			try {
				dispatch(patchNewNotification({ isNewNotification: false })).unwrap();
				dispatch(handleUpdateNewNotification(false));
				dispatch(updateUserInfo({ ...userInfo, isNewNotification: false }));
			} catch (err) {
				NotificationError(err);
			}
		}

		if (pathname !== '/notification') {
			if (Storage.getAccessToken()) {
				setModalNoti(!modalNoti);
				dispatch(backgroundToggle(modalNoti));
			} else {
				dispatch(checkUserLogin(true));
			}
		}
	};

	const tollgleModaleInfoUser = () => {
		setModalInforUser(!modalInforUser);
		if (!Storage.getAccessToken()) {
			navigate(`/login`);
		}
	};

	const handleUserLogin = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		Request.clearToken();
		dispatch(deleteUserInfo());
		dispatch(updateTargetReading([]));
		navigate('/login');
		const customId = 'custom-id-Header';
		toast.success('Đăng xuất thành công', { toastId: customId });
	};

	const onClickReloadPosts = () => {
		dispatch(handleRefreshNewfeed()); // Tải lại newfeed
		window.scrollTo(0, 0);
	};

	const handlePopup = () => {
		if (!isShow) {
			setIsShow(true);
		}
	};

	const handleViewProfile = () => {
		setModalInforUser(false);
		navigate(`/profile/${userInfo.id}`);
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			const value = getSlugResult?.trim();
			if (e.key === 'Enter' && value.length) {
				setIsShow(false);
				if (hashtagRegex.test(value)) {
					const formatedInpSearchValue = value
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.replace(/đ/g, 'd')
						.replace(/Đ/g, 'D')
						.replace(/#/g, '');
					navigate(`/hashtag/${formatedInpSearchValue}`);
				} else {
					navigate(`/result/q=${value}`);
				}
			}
		} else if (e.key !== 'Escape') {
			dispatch(handleUpdateValueInputSearchRedux(''));
			setIsShow(true);
		}
	};

	useEffect(() => {
		// Điền vào ô search
		setGetSlugResult(valueInputSearchRedux);
	}, [valueInputSearchRedux]);

	useEffect(() => {
		// Khi tìm kiếm rồi thì xóa dữ liệu ô input
		if (window.location.pathname.includes('/result/')) {
			dispatch(handleUpdateWentInResult(true));
		} else if (wentInResult) {
			dispatch(handleUpdateValueInputSearchRedux(''));
			dispatch(handleUpdateWentInResult(false));
		}
	}, [window.location.pathname]);

	return (
		<div className='header'>
			<div className='header__left'>
				<div className='header-logo-big'>
					<Link to='/' onClick={onClickReloadPosts}>
						<LogoFull className='header__logo' />
					</Link>
				</div>
				<div className='header-logo-small'>
					<Link to='/' onClick={onClickReloadPosts}>
						<LogoNonText className='header__logo' />
					</Link>
				</div>
				<div className='header__search' onClick={handlePopup}>
					{/* Modal tìm kiếm */}
					{isShow ? (
						<SearchAllModal showRef={showRef} setIsShow={setIsShow} />
					) : (
						<>
							<img className='header__search__icon' src={SearchIcon} alt='search-icon' />
							<input
								className='header__search__input'
								placeholder='Tìm kiếm trên Wisfeed'
								disabled={isShow}
								value={getSlugResult}
								readOnly
								onKeyDown={handleKeyDown}
							/>
						</>
					)}
				</div>
				<HeaderSearchMobile
					searchRef={searchMobileWrapper}
					isShowSearchMobile={isShowSearchMobile}
					setIsShowSearchMobile={setIsShowSearchMobile}
				/>
			</div>

			<ul
				className={classNames('header__nav', {
					'hidden': isShowSearchMobile,
					'show': (!isShowSearchMobile && showNavIcon) || window.innerWidth > 820,
				})}
			>
				<li className={classNames('header__nav__item', { active: activeLink === '/' })}>
					<Link className='header__nav__link' to='/' onClick={onClickReloadPosts}>
						<HomeIcon className='header__nav__icon' />
					</Link>
					<span className='header__nav__item--hover'>Trang chủ</span>
				</li>
				<li
					onClick={handleUserLogin}
					className={classNames('header__nav__item', {
						active: activeLink === `/shelves/${userInfo.id}`,
					})}
				>
					<Link className='header__nav__link' to={!_.isEmpty(userInfo) && `/shelves/${userInfo.id}`}>
						{activeLink === `/shelves/${userInfo.id}` ? <BookFillIcon /> : <BookIcon />}
					</Link>
					<span className='header__nav__item--hover'>Tủ sách</span>
				</li>
				<li className={classNames('header__nav__item', { active: activeLink === '/group' })}>
					<Link className='header__nav__link' to={'/group'}>
						{activeLink === '/group' ? <GroupFillIcon /> : <GroupIcon />}
					</Link>
					<span className='header__nav__item--hover'>Nhóm</span>
				</li>
				<li className={classNames('header__nav__item', { active: activeLink === '/category' })}>
					<Link className='header__nav__link' to={'/category'}>
						{activeLink === '/category' ? <CategoryFillIcon /> : <CategoryIcon />}
					</Link>
					<span className='header__nav__item--hover'>Chủ đề</span>
				</li>
				<li
					onClick={handleUserLogin}
					className={classNames('header__nav__item', { active: activeLink === '/friends' })}
				>
					<Link className='header__nav__link' to={!_.isEmpty(userInfo) && '/friends'}>
						{activeLink === '/friends' ? <FriendsFillIcon /> : <FriendsIcon />}
					</Link>
					<span className='header__nav__item--hover'>Bạn bè</span>
				</li>

				<li
					className={classNames('header__nav__item', { 'active': modalNoti || pathname === '/notification' })}
				>
					<div
						ref={buttonModal}
						onClick={toglleModalNotify}
						className={classNames('header__nav__link', {
							'header__notify__icon--realtime__active':
								isNewNotificationByRealtime &&
								!modalNoti &&
								pathname !== '/notification' &&
								!_.isEmpty(userInfo),
						})}
					>
						<Bell className='header__nav__icon' />
					</div>
					{modalNoti && (
						<div onMouseOver={() => setNotiPopover(false)} onMouseLeave={() => setNotiPopover(true)}>
							<NotificationModal setModalNoti={setModalNoti} buttonModal={buttonModal} />
						</div>
					)}
					<span className={classNames('header__nav__item--hover', { 'hide': !notiPopover })}>Thông báo</span>
				</li>
			</ul>

			<div className='header__userInfo' ref={userOptions}>
				<div className='header__avatar' onClick={tollgleModaleInfoUser}>
					<img
						src={!_.isEmpty(userInfo) && userInfo.avatarImage ? userInfo.avatarImage : defaultAvatar}
						onError={e => e.target.setAttribute('src', `${defaultAvatar}`)}
						alt='avatar'
					/>
				</div>
				<ul
					className={classNames('header__option-info', {
						'show': modalInforUser && localStorage.getItem('accessToken'),
					})}
				>
					<div onClick={handleViewProfile}>
						<li>
							<ProfileIcon />
							&nbsp;Thông tin cá nhân
						</li>
					</div>
					<li onClick={() => handleLogout()}>
						<LogOutIcon />
						&nbsp;Đăng xuất
					</li>
				</ul>
			</div>
		</div>
	);
};

export default memo(Header);
