import { useEffect, useState, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import './sidebar-upload.scss';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useFetchQuotes } from 'api/quote.hooks';
import { useParams } from 'react-router-dom';
import { getRandomAuthor } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { useFetchGroups } from 'api/group.hooks';
const QuotesLinks = lazy(() => import('shared/quote-links'));
const AuthorSlider = lazy(() => import('shared/author-slider'));
const GroupLinks = lazy(() => import('shared/group-links'));
const BookSlider = lazy(() => import('shared/book-slider'));

const SidebarUpload = ({ userInfo, currentUserInfo, handleViewBookDetail }) => {
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
		<Suspense fallback={<div>Loading...</div>}>
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
				<AuthorSlider title='Tác giả nổi bật' list={authorList} size='lg' inUpload={true} />
				<div className='sibar-pop-authors'>
					{!!quoteData.length > 0 && <QuotesLinks list={quoteData} title={`Quotes của tôi`} />}
				</div>
				<GroupLinks list={groupList.slice(0, 3)} title='Group' />
			</div>
		</Suspense>
	);
};

SidebarUpload.propTypes = {
	currentUserInfo: PropTypes.object,
	handleViewCategoryDetail: PropTypes.func,
	handleViewBookDetail: PropTypes.any,
	userInfo: PropTypes.object,
};

export default SidebarUpload;
