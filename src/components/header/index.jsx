import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	LogoIcon,
	BookFillIcon,
	BookIcon,
	CategoryIcon,
	GroupIcon,
	HomeIcon,
	IconGroup,
	LogOutIcon,
	ProfileIcon,
	ArrowDownIcon,
} from 'components/svg';
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
		}
	}, []);

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

	const toggleModalNotify = () => {
		if (pathname === '/notification') {
			setModalNotti(false);
		} else {
			if (Storage.getAccessToken()) {
				setModalNotti(!modalNoti);
				dispatch(backgroundToggle(modalNoti));
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
						onClick={toggleModalNotify}
						className={classNames('header__notify__icon', { 'active': modalNoti || activeNotificaiton })}
					/>
					{modalNoti && <NotificationModal setModalNotti={setModalNotti} buttonModal={buttonModal} />}
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
