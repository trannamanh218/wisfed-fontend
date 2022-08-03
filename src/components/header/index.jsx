import { useEffect, useState, useRef } from 'react';
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
	ArrowDownIcon,
	GroupFillIcon,
	FriendsFillIcon,
	FriendsIcon,
	CategoryFillIcon,
	LogoNonText,
	Hamburger,
} from 'components/svg';
import SearchIcon from 'assets/icons/search.svg';
import classNames from 'classnames';
import './header.scss';
import NotificationModal from 'pages/notification/';
import { useDispatch, useSelector } from 'react-redux';
import { backgroundToggle, depenRenderNotificaion } from 'reducers/redux-utils/notificaiton';
import { checkUserLogin, deleteUserInfo } from 'reducers/redux-utils/auth';
import { useVisible } from 'shared/hooks';
import SearchAllModal from 'shared/search-all';
import Storage from 'helpers/Storage';
import { handleResetValue } from 'reducers/redux-utils/search';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateTargetReading } from 'reducers/redux-utils/chart';
import defaultAvatar from 'assets/images/avatar.jpeg';
import * as stream from 'getstream';
import _ from 'lodash';
import { patchNewNotification, updateIsNewNotificationUserInfo } from 'reducers/redux-utils/auth';
import { handleRefreshNewfeed } from 'reducers/redux-utils/activity';
import Request from 'helpers/Request';
import HamburgerModal from './hamburger-modal/HamburgerModal';

const Header = () => {
	const { ref: showRef, isVisible: isShow, setIsVisible: setIsShow } = useVisible(false);
	const [activeLink, setActiveLink] = useState('/');
	const [modalNoti, setModalNotti] = useState(false);
	const [modalInforUser, setModalInforUser] = useState(false);
	const [getSlugResult, setGetSlugResult] = useState('');
	const [userLogin, setUserLogin] = useState(false);
	const [activeNotificaiton, setActiveNotification] = useState(false);
	const [realTime, setRealTime] = useState(false);
	const [isHamburgerShow, setIsHamburgerShow] = useState(false);

	const buttonModal = useRef(null);
	const userOptions = useRef(null);

	const { value } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { pathname } = location;

	const dispatch = useDispatch();
	const { isShowModal } = useSelector(state => state.search);
	const { userInfo, userInfoJwt } = useSelector(state => state.auth);

	useEffect(() => {
		setActiveLink(pathname);
	}, [pathname]);

	useEffect(() => {
		setGetSlugResult(value);
	}, [value]);

	useEffect(() => {
		if (isShowModal) {
			dispatch(handleResetValue(false));
			setIsShow(false);
		}
	}, [isShowModal]);

	useEffect(() => {
		const params = {
			isNewNotification: false,
		};
		if (pathname === '/notification') {
			setActiveNotification(true);
			setModalNotti(false);
			updateNewNotificaionFalse(params);
			setTimeout(() => setRealTime(false), 1500);
		} else if (modalNoti && realTime) {
			updateNewNotificaionFalse(params);
			setTimeout(() => setRealTime(false), 1500);
		}
	}, [realTime]);

	useEffect(() => {
		if (!_.isEmpty(userInfoJwt)) {
			if (userInfoJwt.isNewNotification) {
				setRealTime(true);
			} else {
				setRealTime(false);
			}
		}
	}, [userInfoJwt]);

	useEffect(() => {
		if (Storage.getAccessToken()) {
			setUserLogin(true);
		} else {
			setUserLogin(false);
		}

		if (userOptions.current) {
			document.addEventListener('click', closeUserOptions);
		}
		return () => {
			document.removeEventListener('click', closeUserOptions);
		};
	}, []);

	const closeUserOptions = e => {
		if (userOptions.current && !userOptions.current.contains(e.target)) {
			setModalInforUser(false);
		}
	};

	const toglleModalNotify = () => {
		const params = {
			isNewNotification: false,
		};
		if (pathname === '/notification') {
			setModalNotti(false);
			setRealTime(false);
			updateNewNotificaionFalse(params);
		} else {
			if (Storage.getAccessToken()) {
				setModalNotti(!modalNoti);
				dispatch(backgroundToggle(modalNoti));
				setRealTime(false);
				updateNewNotificaionFalse(params);
			} else {
				dispatch(checkUserLogin(true));
			}
		}
	};

	const tollgleModaleInfoUser = () => {
		setModalInforUser(!modalInforUser);
		if (Storage.getAccessToken()) {
			return;
		} else {
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

	useEffect(() => {
		if (!_.isEmpty(userInfoJwt)) {
			const client = stream.connect('p77uwpux9zwu', null, '1169912');
			const notificationFeed = client.feed('notification', userInfoJwt.id, userInfoJwt.userToken);

			const callback = data => {
				dispatch(depenRenderNotificaion(true));
				const params = {
					isNewNotification: true,
				};
				if (!userInfoJwt.isNewNotification && !_.isEmpty(data)) {
					setRealTime(true);
					dispatch(patchNewNotification(params)).unwrap();
					const dataNewNoti = { ...userInfoJwt, isNewNotification: true };
					dispatch(updateIsNewNotificationUserInfo(dataNewNoti));
				}
			};
			notificationFeed.subscribe(callback);
		}
	}, [userInfoJwt]);

	const updateNewNotificaionFalse = params => {
		if (userInfoJwt.isNewNotification) {
			dispatch(patchNewNotification(params)).unwrap();
			const dataNewNoti = { ...userInfoJwt, isNewNotification: false };
			dispatch(depenRenderNotificaion(false));
			dispatch(updateIsNewNotificationUserInfo(dataNewNoti));
		}
	};

	const onClickReloadPosts = () => {
		dispatch(handleRefreshNewfeed()); // Tải lại newfeed
		window.scrollTo(0, 0);
	};

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
				<div className='header__search'>
					<img className='header__search__icon' src={SearchIcon} alt='search-icon' />
					<input
						className='header__search__input'
						placeholder='Tìm kiếm trên Wisfeed'
						onClick={() => setIsShow(true)}
						disabled={isShow}
						value={getSlugResult || ''}
						onChange={() => {}}
					/>
				</div>
				<div className='header-search-small' onClick={() => setIsShow(true)}>
					<img className='header__search__icon' src={SearchIcon} alt='search-icon' />
				</div>

				{/* Modal menu hamburger */}
				<HamburgerModal
					isHamburgerShow={isHamburgerShow}
					setIsHamburgerShow={setIsHamburgerShow}
					userInfo={userInfo}
				/>

				<div className='header-hamburger-small' onClick={() => setIsHamburgerShow(!isHamburgerShow)}>
					<div className='header-search-small__hamburger'>
						<Hamburger />
					</div>
				</div>

				{/* Modal tìm kiếm */}
				{isShow ? <SearchAllModal showRef={showRef} setIsShow={setIsShow} /> : ''}
			</div>

			<ul className='header__nav'>
				<li className={classNames('header__nav__item', { active: activeLink === '/' })}>
					<Link className='header__nav__link' to='/' onClick={onClickReloadPosts}>
						<HomeIcon className='header__nav__icon' />
					</Link>
				</li>
				<li
					onClick={handleUserLogin}
					className={classNames('header__nav__item', { active: activeLink === `/shelves/${userInfo.id}` })}
				>
					<Link className='header__nav__link' to={userLogin && `/shelves/${userInfo.id}`}>
						{activeLink === `/shelves/${userInfo.id}` ? <BookFillIcon /> : <BookIcon />}
					</Link>
				</li>
				<li className={classNames('header__nav__item', { active: activeLink === '/group' })}>
					<Link className='header__nav__link' to='/group'>
						{activeLink === '/group' ? <GroupFillIcon /> : <GroupIcon />}
					</Link>
				</li>
				<li
					onClick={handleUserLogin}
					className={classNames('header__nav__item', { active: activeLink === '/category' })}
				>
					<Link className='header__nav__link' to={userLogin && '/category'}>
						{activeLink === '/category' ? <CategoryFillIcon /> : <CategoryIcon />}
					</Link>
				</li>
				<li
					onClick={handleUserLogin}
					className={classNames('header__nav__item', { active: activeLink === '/friends' })}
				>
					<Link className='header__nav__link' to={userLogin && '/friends'}>
						{activeLink === '/friends' ? <FriendsFillIcon /> : <FriendsIcon />}
					</Link>
				</li>

				<div className='notify-icon'>
					<div
						ref={buttonModal}
						onClick={toglleModalNotify}
						className={classNames('header__notify__icon', {
							'active': modalNoti || activeNotificaiton,
							'header__notify__icon__active': realTime,
						})}
					/>

					{modalNoti && (
						<NotificationModal
							setModalNotti={setModalNotti}
							buttonModal={buttonModal}
							realTime={realTime}
						/>
					)}
				</div>
			</ul>

			<div className='header__userInfo' onClick={() => tollgleModaleInfoUser()} ref={userOptions}>
				<div className='header__avatar'>
					<img
						src={userInfo?.avatarImage || defaultAvatar}
						onError={e => e.target.setAttribute('src', `${defaultAvatar}`)}
						alt='avatar'
					/>
					<span id='arrow-down-icon'>
						<ArrowDownIcon />
					</span>
				</div>
				{modalInforUser && localStorage.getItem('accessToken') && (
					<ul className='header__option-info'>
						<Link to={localStorage.getItem('accessToken') && `/profile/${userInfo.id}`}>
							<li>
								<ProfileIcon />
								&nbsp;Thông tin cá nhân
							</li>
						</Link>
						<li onClick={() => handleLogout()}>
							<LogOutIcon />
							&nbsp;Đăng xuất
						</li>
					</ul>
				)}
			</div>
		</div>
	);
};

export default Header;
