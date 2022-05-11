import React, { useState, useEffect } from 'react';
import PopupCreatGroup from './PopupCreatGroup';
// import PopupInviteFriend from './popup-group/popupInviteFriend';
// import PopupQuestion from './popup-group/popupQuestion';
// import MiniPopup from './popup-group/mini-popup';
import SidebarGroupLef from './sidebar-left';
import './mainGroup.scss';
import MainGroupComponent from './popup-group/MainGroupComponet/MainGroupComponent';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getGroupDettail } from 'reducers/redux-utils/group';

const MainGroup = () => {
	const [detailGroup, setDetailGroup] = useState({});
	const dispatch = useDispatch();

	const fetchData = async () => {
		try {
			const res = await dispatch(getGroupDettail(1)).unwrap();
			setDetailGroup(res.data);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);
	const [keyChange, setKeyChange] = useState('tabs');
	const [isShow, setIsShow] = useState(true);
	// const [isInvite, setIsInvite] = useState(false);
	// const [isQuestion, setIsQuestion] = useState(false);
	// const [isMini, setIsMini] = useState(false);
	const handleClose = () => {
		if (isShow === true) {
			setIsShow(!isShow);
		}
		// if (isInvite === true) {
		// 	setIsInvite(!isInvite);
		// }
		// if (isQuestion === true) {
		// 	setIsQuestion(!isQuestion);
		// }
		// if (isMini === true) {
		// 	setIsMini(!isMini);
		// }
	};

	const handleChange = e => {
		setKeyChange(e);
	};

	return (
		<div>
			{/* <div>
				{' '}
				<button
					onClick={() => {
						setIsShow(!isShow);
					}}
				>
					+
				</button>
				{isShow ? (
					<div className='popup-container'>
						<PopupCreatGroup handleClose={handleClose} />
					</div>
				) : (
					''
				)}
				<div>
					<button
						onClick={() => {
							setIsInvite(!isInvite);
						}}
					>
						+
					</button>
					{isInvite ? (
						<div className='popup-container'>
							<PopupInviteFriend handleClose={handleClose} />
						</div>
					) : (
						''
					)}
				</div>
				<div>
					<button
						onClick={() => {
							setIsQuestion(!isQuestion);
						}}
					>
						+
					</button>
					{isQuestion ? (
						<div className='popup-container'>
							<PopupQuestion handleClose={handleClose} />
						</div>
					) : (
						''
					)}
				</div>
				<div>
					<button
						onClick={() => {
							setIsMini(!isMini);
						}}
					>
						+
					</button>
					{isMini ? (
						<div className='popup-container'>
							<MiniPopup />
						</div>
					) : (
						''
					)}
				</div>
			</div> */}
			{isShow ? (
				<div className='popup-container'>
					<PopupCreatGroup handleClose={handleClose} />
				</div>
			) : (
				''
			)}
			<div className='group-main__container'>
				<SidebarGroupLef handleChange={handleChange} data={detailGroup} />
				<MainGroupComponent handleChange={handleChange} keyChange={keyChange} data={detailGroup} />
			</div>
		</div>
	);
};

export default MainGroup;
