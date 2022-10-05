import SearchField from 'shared/search-field';
import { ForwardGroup } from 'components/svg';
import { useState } from 'react';
import '../sidebar-right/RightSideBarGroup.scss';

export default function RightSidebarGroup({ tagGroup }) {
	const [numberIndex, setNumberIndex] = useState(4);
	const [show, setShow] = useState(false);
	const [inputSearch, setInputSearch] = useState('');

	const list = [
		{ name: '#Shadow', quantity: '30 bài viết' },
		{ name: '#GaoRanger', quantity: '30 bài viết' },
		{ name: '#FairyTail', quantity: '30 bài viết' },
		{ name: '#HiềnHồ', quantity: '30 bài viết' },
		{ name: '#Anime', quantity: '30 bài viết' },
	];

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
									<div className='hastag__group-name'>{item.tagName}</div>
									<div className='hastag__group-number'>
										{item.count < 10000 ? item.count : '9999+'} bài viết
									</div>
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
