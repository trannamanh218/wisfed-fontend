import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import './index.scss';
import './mainGroup.scss';
import SubContainer from 'components/layout/sub-container';
import SidebarGroupLef from './sidebar-left';
import { getGroupDettail, getMember, getTagGroup } from 'reducers/redux-utils/group';
import MainGroupComponent from './popup-group/MainGroupComponet/MainGroupComponent';
import RightSidebarGroup from './sidebar-right/RightSidebarGroup';

const Group = () => {
	const dispatch = useDispatch();
	const { id = '' } = useParams();

	const [keyChange, setKeyChange] = useState('tabs');
	const [update, setUpdate] = useState(false);
	const [detailGroup, setDetailGroup] = useState({});
	const [listMember, setListMember] = useState([]);
	const [tagGroup, setTagGroup] = useState([]);

	const fetchData = async () => {
		try {
			const res = await dispatch(getGroupDettail(id)).unwrap();
			setDetailGroup(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getListMember = async () => {
		try {
			const actionGetList = await dispatch(getMember(id)).unwrap();
			setListMember(actionGetList);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getlistTagGroup = async () => {
		const params = {
			id: id,
			body: {
				sort: JSON.stringify([{ property: 'count', direction: 'DESC' }]),
			},
		};
		try {
			const actionGetListTag = await dispatch(getTagGroup(params)).unwrap();
			setTagGroup(actionGetListTag);
		} catch (error) {
			NotificationError(error);
		}
	};

	const handleUpdate = () => {
		setUpdate(!update);
	};

	useEffect(() => {
		getListMember();
	}, []);

	useEffect(() => {
		fetchData();
		getlistTagGroup();
	}, [update]);

	const handleChange = e => {
		setKeyChange(e);
	};

	return (
		<div className='group__main-container'>
			<SubContainer
				left={<SidebarGroupLef handleChange={handleChange} data={detailGroup} member={listMember} />}
				main={
					<MainGroupComponent
						handleUpdate={handleUpdate}
						handleChange={handleChange}
						keyChange={keyChange}
						data={detailGroup}
						member={listMember}
						fetchData={fetchData}
					/>
				}
				right={<RightSidebarGroup tagGroup={tagGroup} />}
			/>
		</div>
	);
};

export default Group;
