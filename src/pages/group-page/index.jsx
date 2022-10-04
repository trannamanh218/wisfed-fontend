import SearchField from 'shared/search-field';
import { useEffect, useState } from 'react';
import { ForwardGroup } from 'components/svg';
import { getTagGroup } from 'reducers/redux-utils/group';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import './index.scss';
import './mainGroup.scss';
import SubContainer from 'components/layout/sub-container';
import SidebarGroupLef from './sidebar-left';
import { getGroupDettail, getMember } from 'reducers/redux-utils/group';
import MainGroupComponent from './popup-group/MainGroupComponet/MainGroupComponent';

const Group = () => {
	const [numberIndex, setNumberIndex] = useState(4);
	const [show, setShow] = useState(false);
	const dispatch = useDispatch();
	const { id = '' } = useParams();
	const [tagGroup, setTagGroup] = useState([]);
	const [inputSearch, setInputSearch] = useState('');

	const [keyChange, setKeyChange] = useState('tabs');
	const [update, setUpdate] = useState(false);
	const [detailGroup, setDetailGroup] = useState({});
	const [listMember, setListMember] = useState([]);

	const list = [
		{ name: '#Shadow', quantity: '30 bài viết' },
		{ name: '#GaoRanger', quantity: '30 bài viết' },
		{ name: '#FairyTail', quantity: '30 bài viết' },
		{ name: '#HiềnHồ', quantity: '30 bài viết' },
		{ name: '#Anime', quantity: '30 bài viết' },
	];

	const listTagGroup = async () => {
		try {
			const actionGetListTag = await dispatch(getTagGroup(id)).unwrap();
			setTagGroup(actionGetListTag);
		} catch (error) {
			NotificationError(error);
		}
	};

	useEffect(() => {
		listTagGroup();
	}, [id]);

	const handleChangeNumber = () => {
		if (numberIndex === 4) {
			setNumberIndex(list?.length);
			setShow(!show);
		} else {
			setNumberIndex(4);
			setShow(!show);
		}
	};

	const onChangeInputSearch = e => {
		setInputSearch(e.target.value);
	};

	const SidebarGroup = () => (
		<div className='group-sibar-right'>
			<h2>Hashtag</h2>
			<SearchField placeholder='Tìm kiếm hashtag' value={inputSearch} handleChange={onChangeInputSearch} />
			<div>
				{tagGroup.map((item, index) => {
					return (
						<>
							{index < numberIndex && (
								<div className='hastag__group'>
									<div className='hastag__group-name'>{item.name}</div>
									<div className='hastag__group-number'>{item.quantity}</div>
								</div>
							)}
						</>
					);
				})}

				{tagGroup.length > 4 && (
					<>
						{!show ? (
							<button className='more__btn' onClick={() => handleChangeNumber()}>
								<ForwardGroup /> Xem thêm
							</button>
						) : (
							<button className='more__btn rotate__more' onClick={() => handleChangeNumber()}>
								<ForwardGroup />
								Thu gọn
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);

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
		fetchData();
		getListMember();
	}, []);

	useEffect(() => {
		fetchData();
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
				right={<SidebarGroup />}
			/>
		</div>
	);
};

export default Group;
