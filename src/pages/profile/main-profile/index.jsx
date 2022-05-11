import { useState, useEffect } from 'react';
import PersonalInfo from './personal-info';
import './main-profile.scss';
import { Tab, Tabs } from 'react-bootstrap';
import QuoteTab from './quote-tab';
import FavoriteAuthorTab from './favorite-author-tab';
import InforTab from './infor-tab';
import BookTab from './book-tab';
import Bookcase from './bookcase-tab';
import PostTab from './post-tab';
import { getUserDetail } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { useParams } from 'react-router-dom';

const MainProfile = () => {
	const { userId } = useParams();
	const [userInfor, setUserInfor] = useState({});
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);

	useEffect(() => {
		getUserDetailData();
	}, [userId, userInfo]);

	const getUserDetailData = async () => {
		try {
			const userData = await dispatch(getUserDetail(userId)).unwrap();
			setUserInfor(userData);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<>
			{!_.isEmpty(userInfor) && (
				<div className='main-profile'>
					<PersonalInfo userInfor={userInfor} />
					<Tabs className='main-profile__tabs' defaultActiveKey={'books'}>
						{/*Notes: Chỉ hiển thị khi user là tác giả, không public */}
						<Tab eventKey='books' title='Sách của tác giả'>
							<BookTab />
						</Tab>
						<Tab eventKey='shelves' title='Tủ sách'>
							<Bookcase userInfo={userInfor} />
						</Tab>
						<Tab eventKey='post' title='Bài viết' className='post-tab-active'>
							<PostTab />
						</Tab>
						<Tab eventKey='infor' title='Giới thiệu'>
							<InforTab userInfo={userInfor} />
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

MainProfile.propTypes = {};

export default MainProfile;
