import MainContainer from 'components/layout/main-container';
import SearchField from 'shared/search-field';
import MainGroup from './MainGroup';
import React, { useState } from 'react';
import { ForwardGroup } from 'components/svg';

const Group = () => {
	const [numberIndex, setNumberIndex] = useState(4);
	const [show, setShow] = useState(false);

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
	const SidebarGroup = () => (
		<div className='group-sibar-right'>
			<h2>Hashtag</h2>
			<SearchField placeholder='Tìm kiếm hashtag' />
			<div>
				{list.map((item, index) => {
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
			</div>
		</div>
	);

	return (
		<div className='group__main-container'>
			<MainContainer main={<MainGroup />} right={<SidebarGroup />} />
		</div>
	);
};

export default Group;
