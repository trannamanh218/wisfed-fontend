import { BackArrow } from 'components/svg';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './mainLayout';
import SidebarLeft from './sidebarLeft';
import PopupCreateGroup from '../PopupCreateGroup';
import { getMyAdminGroup, getMyGroup } from 'reducers/redux-utils/group';
import './style.scss';
import { useDispatch } from 'react-redux';
import MainContainerLeft from 'components/layout/main-container-left';
import SearchField from 'shared/search-field';
import _ from 'lodash';
import { NotificationError } from 'helpers/Error';
// import Circle from 'shared/loading/circle';
import { useVisible } from 'shared/hooks';
import MainLayoutSearch from './MainLayoutSearch';
import { Modal } from 'react-bootstrap';

const LayoutGroup = () => {
	const [myGroup, setMyGroup] = useState([]);
	const [adminGroup, setAdminGroup] = useState([]);
	const [valueGroupSearch, setValueGroupSearch] = useState('');
	const [filter, setFilter] = useState('[]');
	const dispatch = useDispatch();
	const [isShowScreen, setIsShhowScreen] = useState(true);
	// const [isFetching, setIsFetching] = useState(true);
	const [show, setShow] = useState(false);
	const { ref: showRef, isVisible: isShow, setIsVisible: setIsShow } = useVisible(false);

	const listMyGroup = async () => {
		try {
			const actionListMyGroup = await dispatch(getMyGroup());
			setMyGroup(actionListMyGroup.payload.data);
			// setIsFetching(false);
		} catch (error) {
			NotificationError(error);
		}
	};
	const listAdminMyGroup = async () => {
		try {
			const actionlistAdminMyGroup = await dispatch(getMyAdminGroup());
			setAdminGroup(actionlistAdminMyGroup.payload.data);
			// setIsFetching(false);
		} catch (error) {
			NotificationError(error);
		}
	};

	useEffect(() => {
		listMyGroup();
		listAdminMyGroup();
	}, []);

	const handleChange = e => {
		setValueGroupSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const updateInputSearch = value => {
		if (value) {
			const filterValue = value.toLowerCase().trim();
			setFilter(filterValue);
		} else {
			setFilter('[]');
		}
	};
	const debounceSearch = useCallback(_.debounce(updateInputSearch, 500), []);

	useEffect(() => {
		setTimeout(() => {
			if (valueGroupSearch !== '') {
				setIsShhowScreen(false);
			} else {
				setIsShhowScreen(true);
			}
		}, 700);
	}, [valueGroupSearch]);

	const SearchGroup = () => {
		const navigate = useNavigate();
		const handleClick = () => {
			navigate('/');
		};
		return (
			<div className='search-group-container'>
				<div className='group-btn-back'>
					<button onClick={() => handleClick()}>
						<BackArrow />
					</button>{' '}
					<span>Nhóm</span>
				</div>
				<div className='search'>
					<SearchField placeholder='Tìm kiếm group' handleChange={handleChange} value={valueGroupSearch} />
					<button onClick={() => handleShowModal()}>Tạo nhóm </button>
				</div>
			</div>
		);
	};

	const handleCloseModal = () => setShow(false);
	const handleShowModal = () => setShow(true);

	return (
		<>
			<div style={{ position: 'relative' }}>
				{/* <Circle loading={isFetching} /> */}
				<>
					{isShowScreen ? (
						<MainContainerLeft
							sub={<SearchGroup />}
							right={<SidebarLeft listMyGroup={myGroup} listAdminMyGroup={adminGroup} />}
							main={<MainLayout filter={true} />}
						/>
					) : (
						<div className='result-search'>
							<MainContainerLeft
								sub={<SearchGroup />}
								main={<MainLayoutSearch valueGroupSearch={filter} />}
							/>
						</div>
					)}
				</>
			</div>

			<Modal className='create-group-modal' show={show} onHide={handleCloseModal}>
				<Modal.Body>
					<PopupCreateGroup handleClose={handleCloseModal} showRef={showRef} />
				</Modal.Body>
			</Modal>
		</>
	);
};

export default LayoutGroup;
