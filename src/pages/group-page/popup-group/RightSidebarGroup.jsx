import SearchField from 'shared/search-field';
import { ForwardGroup } from 'components/svg';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { getTagGroup } from 'reducers/redux-utils/group';

export default function RightSidebarGroup() {
	const [tagGroup, setTagGroup] = useState([]);
	const [numberIndex, setNumberIndex] = useState(4);
	const [show, setShow] = useState(false);
	const [inputSearch, setInputSearch] = useState('');

	const { id = '' } = useParams();
	const dispatch = useDispatch();

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

	useEffect(() => {
		listTagGroup();
	}, [id]);

	return (
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
}
