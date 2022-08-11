import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './sidebar-upload.scss';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useFetchQuotes } from 'api/quote.hooks';
import BookSlider from 'shared/book-slider';
import QuotesLinks from 'shared/quote-links';
import { useParams } from 'react-router-dom';
import AuthorSlider from 'shared/author-slider';
import { getRandomAuthor } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import GroupLinks from 'shared/group-links';
import { useFetchGroups } from 'api/group.hooks';

const SidebarUpload = ({ userInfo, currentUserInfo, handleViewBookDetail, shelveGroupName }) => {
	const { userId } = useParams();
	const dispatch = useDispatch();
	const { booksAuthor } = useFetchAuthorBooks(userInfo.id);
	const [booksSliderTitle, setBooksSliderTitle] = useState('');
	const [authorList, setAuthorList] = useState([]);

	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);

	const {
		groups: { rows: groupList = [] },
	} = useFetchGroups(0, 3, '[]');

	const getAuthorList = async () => {
		try {
			const params = { limit: 10 };
			const res = await dispatch(getRandomAuthor(params)).unwrap();
			if (res.length) {
				setAuthorList(res);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			if (window.location.pathname.includes('profile')) {
				if (userInfo.id === userId) {
					setBooksSliderTitle('Sách tôi là tác giả');
				} else {
					setBooksSliderTitle(`Sách của ${currentUserInfo.fullName}`);
				}
			} else {
				setBooksSliderTitle('Sách tôi là tác giả');
			}
		}
	}, [userInfo, currentUserInfo]);

	useEffect(() => {
		getAuthorList();
	}, []);

	return (
		<div className='sidebar-upload'>
			{!_.isEmpty(userInfo) && (
				<div className='sidebar-profile'>
					{booksAuthor.length > 0 && (
						<BookSlider
							className='book-reference__slider'
							title={booksSliderTitle}
							list={booksAuthor}
							handleViewBookDetail={handleViewBookDetail}
						/>
					)}
				</div>
			)}
			<AuthorSlider title='Tác giả nổi bật' list={authorList} size='lg' />
			<div className='sibar-pop-authors'>
				{!!quoteData.length && <QuotesLinks list={quoteData} title={`Quotes của tôi`} />}
			</div>
			<GroupLinks list={groupList.slice(0, 3)} title='Group' />
		</div>
	);
};

SidebarUpload.propTypes = {
	currentUserInfo: PropTypes.object,
	handleViewCategoryDetail: PropTypes.func,
	handleViewBookDetail: PropTypes.any,
	shelveGroupName: PropTypes.string,
	userInfo: PropTypes.object,
};

export default SidebarUpload;
