import AuthorCard from 'shared/author-card';
import './favorite-author-tab.scss';
import { getFavoriteAuthor } from 'reducers/redux-utils/profile';
import { useState, useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';

const FavoriteAuthorTab = ({ currentTab }) => {
	const [favoriteAuthorList, setFavoriteAuthorList] = useState([]);
	const { userId } = useParams();

	const dispatch = useDispatch();

	useEffect(() => {
		if (currentTab === 'favorite-authors') {
			getFavoriteAuthorList();
		}
	}, [currentTab]);

	const getFavoriteAuthorList = async () => {
		try {
			const data = {
				id: userId,
			};
			const res = await dispatch(getFavoriteAuthor(data)).unwrap();
			setFavoriteAuthorList(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='favorite-author-tab'>
			{currentTab === 'favorite-authors' && (
				<>
					<h4>Tác giả yêu thích</h4>
					<div className='favorite-author-tab__list'>
						{favoriteAuthorList.length ? (
							favoriteAuthorList.map(item => (
								<AuthorCard key={item.id} direction={'column'} size={'lg'} item={item} />
							))
						) : (
							<p>Không có dữ liệu</p>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default memo(FavoriteAuthorTab);
