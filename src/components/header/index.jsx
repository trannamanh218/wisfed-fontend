import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoIcon, BookFillIcon, BookIcon, CategoryIcon, GroupIcon, HomeIcon } from 'components/svg';
import SearchIcon from 'assets/icons/search.svg';
import classNames from 'classnames';
import './header.scss';
import { useSelector } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import NotificationModal from 'pages/notification/';
import { useDispatch } from 'react-redux';
import { backgroundToggle } from 'reducers/redux-utils/notificaiton';
import { useVisible } from 'shared/hooks';
import SearchAllModal from 'shared/search-all';
import { toast } from 'react-toastify';

const Header = () => {
	const { ref: showRef, isVisible: isShow, setIsVisible: setIsShow } = useVisible(false);

	const [activeLink, setActiveLink] = useState('/');
	const location = useLocation();
	const { pathname } = location;
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const [modalNoti, setModalNotti] = useState(false);
	const buttonModal = useRef(null);
	const [modalInforUser, setModalInforUser] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setActiveLink(pathname);
	}, [pathname]);

	const toglleModalNotify = () => {
		setModalNotti(!modalNoti);
		dispatch(backgroundToggle(modalNoti));
	};

	const tollgleModaleInfoUser = () => {
		setModalInforUser(!modalInforUser);
	};

	const handleLogout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
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
					/>
				</div>
				{isShow ? <SearchAllModal showRef={showRef} /> : ''}
			</div>

			<ul className='header__nav'>
				<li className={classNames('header__nav__item', { active: activeLink === '/' })}>
					<Link className='header__nav__link' to='/'>
						<HomeIcon className='header__nav__icon' />
					</Link>
				</li>
				<li className={classNames('header__nav__item', { active: activeLink === '/category' })}>
					<Link className='header__nav__link' to='/category'>
						<CategoryIcon className='header__nav__icon' />
					</Link>
				</li>
				<li className={classNames('header__nav__item', { active: activeLink === `/shelves/${userInfo.id}` })}>
					<Link className='header__nav__link' to={`/shelves/${userInfo.id}`}>
						{activeLink === `/shelves/${userInfo.id}` ? <BookFillIcon /> : <BookIcon />}
					</Link>
				</li>
				<li className={classNames('header__nav__item', { active: activeLink === '/friends' })}>
					<Link className='header__nav__link' to='/friends'>
						<GroupIcon className='header__nav__icon' />
					</Link>
				</li>
			</ul>
			<div className='header__userInfo'>
				<div>
					<div
						ref={buttonModal}
						onClick={toglleModalNotify}
						className={classNames('header__notify__icon', { 'header__notify__icon__active': modalNoti })}
					/>
					{modalNoti && <NotificationModal setModalNotti={setModalNotti} buttonModal={buttonModal} />}
				</div>
				<div onClick={() => tollgleModaleInfoUser()}>
					<UserAvatar className='header__avatar' source={userInfo?.avatarImage} />
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
		</div>
	);
};

export default Header;
