import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoIcon, BookFillIcon, BookIcon, CategoryIcon, GroupIcon, HomeIcon } from 'components/svg';
import SearchIcon from 'assets/icons/search.svg';
import avatar from 'assets/images/avatar.png';
import classNames from 'classnames';
import './header.scss';

const Header = () => {
	const [activeLink, setActiveLink] = useState('/');
	const location = useLocation();
	const { pathname } = location;

	useEffect(() => {
		setActiveLink(pathname);
	}, [pathname]);

	return (
		<div className='header'>
			<div className='header__left'>
				<LogoIcon className='header__logo' />
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
					<Link className='header__nav__link' to='category'>
						<CategoryIcon className='header__nav__icon' />
					</Link>
				</li>
				<li className={classNames('header__nav__item', { active: activeLink === '/shelves' })}>
					<Link className='header__nav__link' to='shelves'>
						{activeLink === '/shelves' ? <BookFillIcon /> : <BookIcon />}
					</Link>
				</li>
				<li className={classNames('header__nav__item', { active: activeLink === '/group' })}>
					<Link className='header__nav__link' to='group'>
						<GroupIcon className='header__nav__icon' />
					</Link>
				</li>
			</ul>
			<div className='header__userInfo'>
				<div className='header__notify__icon' />
				<img className='header__avatar' src={avatar} alt='avatar' />
			</div>
		</div>
	);
};

export default Header;
