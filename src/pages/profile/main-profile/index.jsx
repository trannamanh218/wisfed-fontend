import React from 'react';
import PersonalInfo from './personal-info';
import './main-profile.scss';
import { Tab, Tabs } from 'react-bootstrap';
import QuoteTab from './quote-tab';
import FavoriteAuthorTab from './favorite-author-tab';
import InforTab from './infor-tab';

const MainProfile = () => {
	const favoriteAuthors = [...Array(2)];
	return (
		<div className='main-profile'>
			<PersonalInfo />
			<Tabs className='main-profile__tabs' defaultActiveKey={'infor'}>
				{/*Notes: Chỉ hiển thị khi user là tác giả, không public */}
				<Tab eventKey='books' title='Sách của tác giả'>
					Lorem ipsum dolor sit amet.
				</Tab>
				<Tab eventKey='shelves' title='Tủ sách'>
					Lorem, ipsum dolor sit amet consectetur adipisicing.
				</Tab>
				<Tab eventKey='articles' title='Bài viết'>
					Lorem, ipsum dolor sit amet consectetur adipisicing.
				</Tab>
				<Tab eventKey='infor' title='Giới thiệu'>
					<InforTab />
				</Tab>
				<Tab eventKey='quotes' title='Quotes'>
					<QuoteTab />
				</Tab>
				<Tab eventKey='favorite-authors' title='Tác giả yêu thích'>
					<FavoriteAuthorTab list={favoriteAuthors} />
				</Tab>
			</Tabs>
		</div>
	);
};

MainProfile.propTypes = {};

export default MainProfile;
