import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import './index.scss';
import './mainGroup.scss';
import SubContainer from 'components/layout/sub-container';
import SidebarGroupLef from './sidebar-left';
import { getGroupDettail, getMember } from 'reducers/redux-utils/group';
import MainGroupComponent from './popup-group/MainGroupComponet/MainGroupComponent';
import RightSidebarGroup from './sidebar-right/RightSidebarGroup';
import { updateKey } from 'reducers/redux-utils/group';

const Group = () => {
	const dispatch = useDispatch();
	const { id } = useParams();

	const [keyChange, setKeyChange] = useState('tabs');
	const [update, setUpdate] = useState(false);
	const [detailGroup, setDetailGroup] = useState({});
	const [listMember, setListMember] = useState([]);
	const [eventKey, setEventKey] = useState('intro');
	const [toggleClickSeeMore, setToggleClickSeeMore] = useState(false);

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

	const handleUpdate = () => {
		setUpdate(!update);
	};

	useEffect(() => {
		getListMember();
	}, []);

	useEffect(() => {
		fetchData();
	}, [update, id]);

	const handleChange = e => {
		setKeyChange(e);
	};

	const onClickSeeMore = () => {
		dispatch(updateKey('intro'));
		setEventKey('intro');
		setToggleClickSeeMore(true);
	};

	return (
		<div className='group__main-container'>
			<SubContainer
				left={
					<SidebarGroupLef
						handleChange={handleChange}
						data={detailGroup}
						member={listMember}
						onClickSeeMore={onClickSeeMore}
					/>
				}
				main={
					<MainGroupComponent
						handleUpdate={handleUpdate}
						handleChange={handleChange}
						keyChange={keyChange}
						data={detailGroup}
						member={listMember}
						fetchData={fetchData}
						eventKey={eventKey}
						setEventKey={setEventKey}
						toggleClickSeeMore={toggleClickSeeMore}
						setToggleClickSeeMore={setToggleClickSeeMore}
					/>
				}
				right={<RightSidebarGroup update={update} />}
			/>
		</div>
	);
};

export default Group;
