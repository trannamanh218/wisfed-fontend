import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './index.scss';
import './mainGroup.scss';
import SubContainer from 'components/layout/sub-container';
import SidebarGroupLef from './sidebar-left';
import { getGroupDettail, getMember } from 'reducers/redux-utils/group';
import MainGroupComponent from './popup-group/MainGroupComponet/MainGroupComponent';
import RightSidebarGroup from './sidebar-right/RightSidebarGroup';
import { updateKey, handleToggleUpdate } from 'reducers/redux-utils/group';
import NotFound from 'pages/not-found';
import _ from 'lodash';

const Group = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const toggleUpdate = useSelector(state => state.group.toggleUpdate);

	const [keyChange, setKeyChange] = useState('tabs');
	const [detailGroup, setDetailGroup] = useState({});
	const [listMember, setListMember] = useState([]);
	const [eventKey, setEventKey] = useState('intro');
	const [toggleClickSeeMore, setToggleClickSeeMore] = useState(false);
	const [renderNotFound, setRenderNotFound] = useState(false);

	const fetchData = async () => {
		try {
			const res = await dispatch(getGroupDettail(id)).unwrap();
			setDetailGroup(res);
		} catch (err) {
			setRenderNotFound(true);
		}
	};

	const getListMember = async () => {
		try {
			const actionGetList = await dispatch(getMember(id)).unwrap();
			setListMember(actionGetList);
		} catch (err) {
			return;
		}
	};

	const handleUpdate = () => {
		dispatch(handleToggleUpdate());
	};

	useEffect(() => {
		getListMember();
	}, []);

	useEffect(() => {
		fetchData();
	}, [toggleUpdate, id]);

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
			{!_.isEmpty(detailGroup) ? (
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
					right={<RightSidebarGroup update={toggleUpdate} />}
				/>
			) : (
				<>{renderNotFound ? <NotFound /> : <></>}</>
			)}
		</div>
	);
};

export default Group;
