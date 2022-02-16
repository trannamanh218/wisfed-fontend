import React, { useState } from 'react';
import Button from 'shared/button';
import EyeIcon from 'shared/eye-icon';
import SearchField from 'shared/search-field';
import Shelf from 'shared/shelf';
import './main-shelves.scss';

const MainShelves = () => {
	const [isPublic, setIsPublic] = useState(true);

	const listBookSheve = [...Array(20)].map((_, index) => ({
		data: {
			source: '/images/book1.jpg',
			name: 'Bán đảo Ả rập – Tinh thần hồi giáo và thảm kịch dầu mỏ',
			author: 'Nguyễn Hiến Lê',
			rating: 4,
			isPublic: true,
			id: index,
		},
		isMyShelve: true,
	}));

	const handlePublic = () => {
		setIsPublic(!isPublic);
	};

	return (
		<div className='main-shelves'>
			<div className='main-shelves__header'>
				<h4>Tủ sách của tôi</h4>
				<SearchField placeholder='Tìm kiếm sách' className='main-shelves__search' />
			</div>
			<div className='main-shelves__pane'>
				<div className='main-shelves__filters'>
					<select className='select-shelf'>
						<option>giasach2021</option>
						<option>giasach2022</option>
						<option>gia sach cua toi</option>
						<option>sach hay</option>
					</select>
					<Button className='btn-private' isOutline={true} onClick={handlePublic}>
						<EyeIcon isPublic={isPublic} handlePublic={handlePublic} />
						<span>{isPublic ? 'Công khai' : 'Không công khai'}</span>
					</Button>
				</div>
				<Shelf list={listBookSheve} />
			</div>
		</div>
	);
};

MainShelves.propTypes = {};

export default MainShelves;
