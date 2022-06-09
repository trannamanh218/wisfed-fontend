import { BackArrow, Search } from 'components/svg';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './mainLayout';
import SidebarLeft from './sidebarLeft';
import PopupCreateGroup from '../PopupCreateGroup';
import { getGroupList, getMyAdminGroup, getMyGroup } from 'reducers/redux-utils/group';
import './style.scss';
import { useDispatch } from 'react-redux';
import MainContainerLeft from 'components/layout/main-container-left';
const LayoutGroup = () => {
	const [isShow, setIsShow] = useState(false);
	const [myGroup, setMyGroup] = useState([]);
	const [adminGroup, setAdminGroup] = useState([]);
	const [list, setList] = useState([]);
	const dispatch = useDispatch();

	const handleClose = () => {
		setIsShow(!isShow);
	};

	const listGroup = async () => {
		const actionGetList = await dispatch(getGroupList());
		setList(actionGetList.payload.rows);
	};

	const listMyGroup = async () => {
		const actionListMyGroup = await dispatch(getMyGroup());
		setMyGroup(actionListMyGroup.payload.data);
	};
	const listAdminMyGroup = async () => {
		const actionlistAdminMyGroup = await dispatch(getMyAdminGroup());
		setAdminGroup(actionlistAdminMyGroup.payload.data);
	};

	useEffect(() => {
		listGroup();
		listMyGroup();
		listAdminMyGroup();
	}, []);

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
				<div className='search-feild'>
					<Search />
					<input placeholder='Tìm kiếm theo từ khóa sách và chủ đề' />{' '}
					<button onClick={() => handleClose()}>Tạo nhóm </button>
				</div>
			</div>
		);
	};
	return (
		<div style={{ position: 'relative' }}>
			{isShow ? (
				<div>
					<PopupCreateGroup handleClose={handleClose} />
				</div>
			) : (
				''
			)}
			<MainContainerLeft
				sub={<SearchGroup />}
				right={<SidebarLeft listMyGroup={myGroup} listAdminMyGroup={adminGroup} />}
				main={<MainLayout listGroup={list} />}
			/>
		</div>
	);
};

export default LayoutGroup;
