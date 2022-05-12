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

const MainProfile = ({ currentUserInfo }) => {
	return (
		<>
			{!_.isEmpty(currentUserInfo) && (
				<div className='main-profile'>
					<PersonalInfo currentUserInfo={currentUserInfo} />
					<Tabs className='main-profile__tabs' defaultActiveKey={'books'}>
						{/*Notes: Chỉ hiển thị khi user là tác giả, không public */}
						<Tab eventKey='books' title='Sách của tác giả'>
							<BookTab />
						</Tab>
						<Tab eventKey='shelves' title='Tủ sách'>
							<Bookcase userInfo={currentUserInfo} />
						</Tab>
						<Tab eventKey='post' title='Bài viết' className='post-tab-active'>
							<PostTab />
						</Tab>
						<Tab eventKey='infor' title='Giới thiệu'>
							<InforTab userInfo={currentUserInfo} />
						</Tab>
						<Tab eventKey='quotes' title='Quotes'>
							<QuoteTab />
						</Tab>
						<Tab eventKey='favorite-authors' title='Tác giả yêu thích'>
							<FavoriteAuthorTab list={[]} />
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
