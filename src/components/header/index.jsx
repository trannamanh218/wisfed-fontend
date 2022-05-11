import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoIcon, BookFillIcon, BookIcon, CategoryIcon, GroupIcon, HomeIcon } from 'components/svg';
import SearchIcon from 'assets/icons/search.svg';
import classNames from 'classnames';
import './header.scss';
import { useSelector } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import NotificationModal from 'pages/notification/';
import { useDispatch } from 'react-redux';
import { backgroundToggle } from 'reducers/redux-utils/notificaiton';

const Header = () => {
	const [activeLink, setActiveLink] = useState('/');
	const location = useLocation();
	const { pathname } = location;
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const [modalNoti, setModalNotti] = useState(false);
	const buttonModal = useRef(null);

	useEffect(() => {
		setActiveLink(pathname);
	}, [pathname]);

	const toglleModalNotify = () => {
		setModalNotti(!modalNoti);
		dispatch(backgroundToggle(modalNoti));
	};

	return (
		<div className='header'>
			<div className='header__left'>
				<Link to='/'>
					<LogoIcon className='header__logo' />
				</Link>
				<div className='header__search'>
					<img className='header__search__icon' src={SearchIcon} alt='search-icon' />
					<input className='header__search__input' placeholder='Tìm kiếm trên Wisfeed' />
				</div>
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
				<Link to={`/profile/${userInfo.id}`}>
					<UserAvatar className='header__avatar' source={userInfo?.avatarImage} />
				</Link>
			</div>
		</div>
	);
};

export default Header;
