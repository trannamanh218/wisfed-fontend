import { BackArrow, Search } from 'components/svg';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './mainLayout';
import SidebarLeft from './sidebarLeft';
import PopupCreateGroup from '../PopupCreateGroup';
import { getGroupList, getMyAdminGroup, getMyGroup } from 'reducers/redux-utils/group';
import './style.scss';
import { useDispatch } from 'react-redux';
import MainContainerLeft from 'components/layout/main-container-left';
import SearchField from 'shared/search-field';
import { getFilterSearch } from 'reducers/redux-utils/search';
import _ from 'lodash';
import { NotificationError } from 'helpers/Error';

const LayoutGroup = () => {
	const [isShow, setIsShow] = useState(false);
	const [myGroup, setMyGroup] = useState([]);
	const [adminGroup, setAdminGroup] = useState([]);
	const [list, setList] = useState([]);
	const [valueGroupSearch, setValueGroupSearch] = useState('');
	const [getListGroup, setListGroup] = useState([]);
	const [filter, setFilter] = useState('[]');
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

	const handleChange = e => {
		setValueGroupSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const updateInputSearch = value => {
		if (value) {
			const filterValue = value.toLowerCase().trim();
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('[]');
		}
	};
	const debounceSearch = useCallback(_.debounce(updateInputSearch, 1000), []);

	useEffect(async () => {
		const params = {
			q: filter,
			type: 'groups',
		};
		try {
			if (valueGroupSearch.length > 0) {
				const result = await dispatch(getFilterSearch({ ...params })).unwrap();
				setListGroup(result.rows);
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [filter]);

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
					{/* <Search /> */}
					<SearchField placeholder='Tìm kiếm group' handleChange={handleChange} value={valueGroupSearch} />
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
