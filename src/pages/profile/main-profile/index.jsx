import PersonalInfo from './personal-info';
import './main-profile.scss';
import { Tab, Tabs } from 'react-bootstrap';
import QuoteTab from './quote-tab';
import FavoriteAuthorTab from './favorite-author-tab';
import InforTab from './infor-tab';
import BookTab from './book-tab';
import Bookcase from './bookcase-tab';
import PostTab from './post-tab';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from 'classnames';

const MainProfile = ({ currentUserInfo }) => {
	const [currentTab, setCurrentTab] = useState('bookcase');

	return (
		<>
			{!_.isEmpty(currentUserInfo) && (
				<div className='main-profile'>
					<PersonalInfo currentUserInfo={currentUserInfo} setCurrentTab={setCurrentTab} />
					<Tabs
						className={classNames('main-profile__tabs', {
							'none-books': currentUserInfo?.role !== 'author',
						})}
						// defaultActiveKey
						activeKey={currentTab}
						onSelect={eventKey => setCurrentTab(eventKey)}
					>
						<Tab eventKey='bookcase' title='Tủ sách'>
							<Bookcase userInfo={currentUserInfo} currentTab={currentTab} />
						</Tab>
						<Tab eventKey='post' title='Bài viết' className='post-tab-active'>
							<PostTab currentTab={currentTab} />
						</Tab>
						{/*Notes: Chỉ hiển thị khi user là tác giả, không public */}
						{currentUserInfo?.role === 'author' && (
							<Tab eventKey='books' title='Sách của tác giả'>
								<BookTab currentTab={currentTab} />
							</Tab>
						)}
						<Tab eventKey='infor' title='Giới thiệu'>
							<InforTab userInfo={currentUserInfo} currentTab={currentTab} />
						</Tab>
						<Tab eventKey='quotes' title='Quotes'>
							<QuoteTab currentTab={currentTab} />
						</Tab>
						<Tab eventKey='favorite-authors' title='Tác giả yêu thích'>
							<FavoriteAuthorTab currentTab={currentTab} />
						</Tab>
					</Tabs>
				</div>
			)}
		</>
	);
};

MainProfile.propTypes = {
	currentUserInfo: PropTypes.object,
};

export default MainProfile;
