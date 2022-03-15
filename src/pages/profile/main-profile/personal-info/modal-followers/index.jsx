import './modal-followers.scss';
import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import AuthorCard from 'shared/author-card';
import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import { backgroundToggle } from 'reducers/redux-utils/notificaiton';
import { useDispatch } from 'react-redux';

const ModalFollowers = ({ idModalItem, setModalWatching }) => {
	const dispatch = useDispatch();
	const settingsRef = useRef(null);
	const handleClickOutside = e => {
		if (settingsRef.current && !settingsRef.current.contains(e.target)) {
			setModalWatching(false);
			dispatch(backgroundToggle(true));
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	const favoriteAuthors = [...Array(4)];
	return (
		<div ref={settingsRef} className='modalFollowers__container'>
			<div className='modalFollowers__header'>
				<div className='modalFollowers__title'>
					{idModalItem === 'followers'
						? 'Người theo dõi Phương Anh Nguyễn'
						: 'Người Phương Anh Nguyễn đang theo dõi'}
				</div>
				<div className='modalFollowers__close'>
					<CloseX />
				</div>
			</div>
			<div className='modalFollowers__search'>
				<SearchField placeholder='Tìm kiếm trên Wisfeed' />
			</div>
			<div className='modalFollowers__info'>
				{favoriteAuthors.map((item, index) => (
					<AuthorCard direction={'row'} key={index} size={'md'} />
				))}
			</div>
		</div>
	);
};
ModalFollowers.propTypes = {
	idModalItem: PropTypes.string,
	setModalWatching: PropTypes.func,
};
export default ModalFollowers;
