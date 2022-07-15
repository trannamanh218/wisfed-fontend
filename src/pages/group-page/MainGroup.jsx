import React, { useState, useEffect } from 'react';

import SidebarGroupLef from './sidebar-left';
import './mainGroup.scss';
import MainGroupComponent from './popup-group/MainGroupComponet/MainGroupComponent';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getGroupDettail, getMember } from 'reducers/redux-utils/group';
import { useParams } from 'react-router-dom';

const MainGroup = () => {
	const [update, setUpdate] = useState(false);
	const { id = '' } = useParams();
	const [detailGroup, setDetailGroup] = useState({});
	const [listMember, setListMember] = useState([]);
	const dispatch = useDispatch();

	const fetchData = async () => {
		try {
			const res = await dispatch(getGroupDettail(id)).unwrap();
			setDetailGroup(res.data);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getListMember = async () => {
		try {
			const actionGetList = await dispatch(getMember(id)).unwrap();
			setListMember(actionGetList);
		} catch (err) {
			// NotificationError(err);
		}
	};
	console.log(update);

	const handleUpdate = () => {
		setUpdate(!update);
	};
	useEffect(() => {
		fetchData();
		getListMember();
	}, []);
	useEffect(() => {
		fetchData();
	}, [update]);

	const [keyChange, setKeyChange] = useState('tabs');

	const handleChange = e => {
		setKeyChange(e);
	};

	return (
		<div className='main__main-group'>
			<div className='group-main__container'>
				<SidebarGroupLef handleChange={handleChange} data={detailGroup} member={listMember} />
				<MainGroupComponent
					handleUpdate={handleUpdate}
					handleChange={handleChange}
					keyChange={keyChange}
					data={detailGroup}
					member={listMember}
				/>
			</div>
		</div>
	);
};

export default MainGroup;
