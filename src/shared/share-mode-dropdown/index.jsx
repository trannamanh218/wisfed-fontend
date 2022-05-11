import './share-mode-dropdown.scss';
import { GroupIcon, Lock, PodCast, WorldNet } from 'components/svg';
import { useState } from 'react';
import classNames from 'classnames';

function ShareModeDropdown() {
	const [currentShareMode, setCurrentShareMode] = useState('public');
	const [show, setShow] = useState(false);

	const shareModeList = [
		{ value: 'public', title: 'Mọi người', icon: <WorldNet /> },
		{ value: 'friends', title: 'Bạn bè', icon: <GroupIcon className='group-icon-svg' /> },
		{ value: 'followers', title: 'Người Follow', icon: <PodCast /> },
		{ value: 'private', title: 'Chỉ mình tôi', icon: <Lock /> },
	];

	const renderShareIcon = () => {
		if (currentShareMode === 'public') {
			return <WorldNet />;
		} else if (currentShareMode === 'friends') {
			return <GroupIcon className='group-icon-svg' />;
		} else if (currentShareMode === 'followers') {
			return <PodCast />;
		} else {
			return <Lock />;
		}
	};

	const selectShareMode = value => {
		setCurrentShareMode(value);
		setShow(false);
	};

	return (
		<div className='share-mode-dropdown'>
			<button className='share-mode-selected' onClick={() => setShow(!show)}>
				{renderShareIcon()}
			</button>
			<div
				className={classNames('share-mode-list', {
					'show': show,
				})}
			>
				{shareModeList.map((item, index) => (
					<button key={index} className='share-mode-list__item' onClick={() => selectShareMode(item.value)}>
						{item.icon}
						<div>{item.title}</div>
					</button>
				))}
			</div>
		</div>
	);
}

export default ShareModeDropdown;
