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
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const MainProfile = () => {
	const [userInfo, setUserInfo] = useState({});

	const dispatch = useDispatch();
	const updateUserProfile = useSelector(state => state.user.updateUserProfile);

	useEffect(() => {
		getUserDetailData();
	}, [updateUserProfile]);

	const getUserDetailData = async () => {
		try {
			const userData = await dispatch(getUserDetail('bfdb3971-de4c-4c2b-bbbe-fbb36770031a')).unwrap();
			setUserInfo(userData);
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	return (
		<div className='main-profile'>
			<PersonalInfo userInfo={userInfo} />
			<Tabs className='main-profile__tabs' defaultActiveKey={'books'}>
				{/*Notes: Chỉ hiển thị khi user là tác giả, không public */}
				<Tab eventKey='books' title='Sách của tác giả'>
					<BookTab />
				</Tab>
				<Tab eventKey='shelves' title='Tủ sách'>
					<Bookcase />
				</Tab>
				<Tab eventKey='post' title='Bài viết' className='post-tab-active'>
					<PostTab />
				</Tab>
				<Tab eventKey='infor' title='Giới thiệu'>
					<InforTab userInfo={userInfo} />
				</Tab>
				<Tab eventKey='quotes' title='Quotes'>
					<QuoteTab />
				</Tab>
				<Tab eventKey='favorite-authors' title='Tác giả yêu thích'>
					<FavoriteAuthorTab list={[]} />
				</Tab>
			</Tabs>
		</div>
	);
};

MainProfile.propTypes = {};

export default MainProfile;
