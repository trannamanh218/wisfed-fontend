import React, { useState } from 'react';
import SearchField from 'shared/search-field';
// import classNames from 'classnames';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import IntroGroup from './component/introGroup';
import MainPostGroup from './component/MainPostGroup';
import MemberGroup from './component/MemberGroup';
import './style.scss';
import { ActionPlusGroup, LogInCircle } from 'components/svg';

function MainGroupComponent() {
	const [key, setKey] = useState('intro');
	return (
		<div className='group-main-component__container'>
			<div className='group__background'>
				<div>
					<img
						src='https://img4.thuthuatphanmem.vn/uploads/2020/08/28/anh-bia-dep-danh-cho-zalo_093733432.jpg'
						alt=''
					/>
				</div>
				<div className='group__title-name'>
					<span>Nhóm của Shadow</span>
				</div>
			</div>
			<div className='group-name'>
				<div className='group-name__content'>
					<h2>Cộng đồng tuổi trẻ và ước mơ</h2>
					<div className='group-name__member'>
						<span>1 triệu thành viên</span>
					</div>
				</div>
				<div className='group-name__btn'>
					<div className='btn-top'>
						<div className='group-name__join-group'>
							<button>
								<LogInCircle />
								Yêu cầu tham gia
							</button>
						</div>
						<div className='group-name__invite-group'>
							<button>
								<ActionPlusGroup />
								Mời
							</button>
						</div>
					</div>

					<div className='group__search'>
						<SearchField placeholder='Tìm kiếm sách, chủ để, hashtag ...' />
					</div>
				</div>
			</div>
			<div className='group-tabs'>
				<Tabs id='controlled-tab' activeKey={key} onSelect={k => setKey(k)} className='mb-3'>
					<Tab eventKey='intro' title='Giới thiệu'>
						<IntroGroup />
					</Tab>
					<Tab eventKey='post' title='Bài viết'>
						<MainPostGroup />
					</Tab>
					<Tab eventKey='member' title='Thành viên'>
						<MemberGroup />
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}

export default MainGroupComponent;
