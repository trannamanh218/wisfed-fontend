import SubContainer from 'components/layout/sub-container';
import { BackArrow, Search } from 'components/svg';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './mainLayout';
import SidebarLeft from './sidebarLeft';
import SidebarRight from './sidebarRight';
import PopupCreateGroup from '../PopupCreateGroup';
import './style.scss';
const LayoutGroup = () => {
	const [isShow, setIsShow] = useState(false);

	const handleClose = () => {
		setIsShow(!isShow);
	};
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
					<Search />
					<input placeholder='Tìm kiếm theo từ khóa sách và chủ đề' />{' '}
					<button onClick={() => handleClose()}>Tạo nhóm </button>
				</div>
			</div>
		);
	};
	return (
		<div>
			{isShow ? <PopupCreateGroup handleClose={handleClose} /> : ''}
			<SubContainer sub={<SearchGroup />} left={<SidebarLeft />} main={<MainLayout />} right={<SidebarRight />} />
		</div>
	);
};

export default LayoutGroup;
