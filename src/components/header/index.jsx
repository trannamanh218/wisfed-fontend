import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoIcon, BookFillIcon, BookIcon, CategoryIcon, GroupIcon, HomeIcon, IconGroup } from 'components/svg';
import SearchIcon from 'assets/icons/search.svg';
import classNames from 'classnames';
import './header.scss';
import NotificationModal from 'pages/notification/';
import { useDispatch, useSelector } from 'react-redux';
import { backgroundToggle } from 'reducers/redux-utils/notificaiton';
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
import { patchNewNotification, updateUserInfo } from 'reducers/redux-utils/auth';

const Header = () => {
	const { isShowModal } = useSelector(state => state.search);
	const { ref: showRef, isVisible: isShow, setIsVisible: setIsShow } = useVisible(false);
	const navigate = useNavigate();
	const [activeLink, setActiveLink] = useState('/');
	const location = useLocation();
	const { pathname } = location;
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const [modalNoti, setModalNotti] = useState(false);
	const buttonModal = useRef(null);
	const [modalInforUser, setModalInforUser] = useState(false);
	const { value } = useParams();
	const [getSlugResult, setGetSlugResult] = useState('');
	const [userLogin, setUserLogin] = useState(false);
	const [activeNotificaiton, setActiveNotification] = useState(false);
	const [realTime, setRealTime] = useState(false);

	const userOptions = useRef(null);

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
		if (pathname === '/notification') {
			setActiveNotification(true);
			setModalNotti(false);
			setTimeout(() => setRealTime(false), 1500);
		} else if (modalNoti) {
			const params = {
				isNewNotification: false,
			};
			updateNewNotificaionFalse(params);
			setTimeout(() => setRealTime(false), 1500);
		}
	}, [realTime]);

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			if (userInfo.isNewNotification) {
				setRealTime(true);
			} else {
				setRealTime(false);
			}
		}
	}, [userInfo]);

	useEffect(() => {
		if (Storage.getAccessToken()) {
			setUserLogin(true);
		} else {
			setUserLogin(false);
		}

		if (userOptions.current) {
			document.addEventListener('click', closeUserOptions);
			return () => {
				document.removeEventListener('click', closeUserOptions);
			};
		}
	}, []);

	const closeUserOptions = e => {
		if (userOptions.current && !userOptions.current.contains(e.target)) {
			setModalInforUser(false);
		}
	};

	const updateNewNotificaionFalse = async params => {
		if (userInfo.isNewNotification) {
			const updateUserInfoData = await dispatch(patchNewNotification(params)).unwrap();
			if (!_.isEmpty(updateUserInfoData)) {
				const dataNewNoti = { ...userInfo, isNewNotification: updateUserInfoData.isNewNotification };
				dispatch(updateUserInfo(dataNewNoti));
			}
		}
	};

	const updateNewNotificaionTrue = params => {
		if (!userInfo.isNewNotification) {
			const updateUserInfoData = dispatch(patchNewNotification(params)).unwrap();
			if (!_.isEmpty(updateUserInfoData)) {
				const dataNewNoti = { ...userInfo, isNewNotification: updateUserInfoData.isNewNotification };
				dispatch(updateUserInfo(dataNewNoti));
			}
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
		dispatch(deleteUserInfo());
		dispatch(updateTargetReading([]));
		navigate('/login');
		toast.success('Đăng xuất thành công');
	};

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			const client = stream.connect('p77uwpux9zwu', null, '1169912');
			const notificationFeed = client.feed('notification', userInfo.id, userInfo.userToken);
			const callback = data => {
				if (!_.isEmpty(data)) {
					setRealTime(true);
					const params = {
						isNewNotification: true,
					};
					return updateNewNotificaionTrue(params);
				}
			};
			const successCallback = () => {
				// console.log('now listening to changes in realtime');
			};
			const failCallback = data => {
				// console.log('something went wrong, check the console logs');
			};
			notificationFeed.subscribe(callback).then(successCallback, failCallback);
		}
	}, []);

	return (
		<div className='header'>
			<div className='header__left'>
				<Link to='/'>
					<LogoIcon className='header__logo' />
				</Link>
				<div className='header__search'>
					<img className='header__search__icon' src={SearchIcon} alt='search-icon' />
					<input
						className='header__search__input'
						placeholder='Tìm kiếm trên Wisfeed'
						onClick={() => setIsShow(true)}
						disabled={isShow}
						value={getSlugResult || ''}
					/>
				</div>
				{isShow ? <SearchAllModal showRef={showRef} setIsShow={setIsShow} /> : ''}
			</div>

			<ul className='header__nav'>
				<li className={classNames('header__nav__item', { active: activeLink === '/' })}>
					<Link className='header__nav__link' to='/'>
						<HomeIcon className='header__nav__icon' />
					</Link>
				</li>
				<li
					onClick={handleUserLogin}
					className={classNames('header__nav__item', { active: activeLink === '/category' })}
				>
					<Link className='header__nav__link' to={userLogin && '/category'}>
						<CategoryIcon className='header__nav__icon' />
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
						<IconGroup className='header__nav__icon' />
					</Link>
				</li>
				<li
					onClick={handleUserLogin}
					className={classNames('header__nav__item', { active: activeLink === '/friends' })}
				>
					<Link className='header__nav__link' to={userLogin && '/friends'}>
						<GroupIcon className='header__nav__icon' />
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
				</div>
				{modalInforUser && localStorage.getItem('accessToken') && (
					<ul className='header__option-info'>
						<Link to={localStorage.getItem('accessToken') && `/profile/${userInfo.id}`}>
							<li>Thông tin cá nhân</li>
						</Link>
						<li onClick={() => handleLogout()}>Đăng xuất</li>
					</ul>
				)}
			</div>
		</div>
	);
};

export default Header;
