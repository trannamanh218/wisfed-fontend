import AuthorCard from 'shared/author-card';
import './favorite-author-tab.scss';
import { getFavoriteAuthor } from 'reducers/redux-utils/profile';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';

const FavoriteAuthorTab = () => {
	const [favoriteAuthorList, setFavoriteAuthorList] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		getFavoriteAuthorList();
	}, []);

	const getFavoriteAuthorList = async () => {
		try {
			const res = await dispatch(getFavoriteAuthor()).unwrap();
			setFavoriteAuthorList(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='favorite-author-tab'>
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
		</div>
	);
};

export default FavoriteAuthorTab;
