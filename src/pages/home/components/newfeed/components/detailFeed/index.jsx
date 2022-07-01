import NormalContainer from 'components/layout/normal-container';
import Post from 'shared/post';
import { getDetailFeed, getDetailFeedGroup } from 'reducers/redux-utils/notificaiton';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import './detail-feed.scss';

const DetailFeed = () => {
	const dispatch = useDispatch();
	const [detailFeed, setDetailFedd] = useState([]);
	const { idPost, type } = useParams();

	useEffect(async () => {
		const params = {
			id: idPost,
		};

		try {
			let res = [];
			if (type === 'commentMiniPost') {
				res = await dispatch(getDetailFeed(params)).unwrap();
			} else {
				res = await dispatch(getDetailFeedGroup(params)).unwrap();
			}
			setDetailFedd(res);
		} catch (err) {
			NotificationError(err);
		}
	}, []);

	return (
		<NormalContainer>
			<div className='detail_feed_container'>
				{type === 'commentMiniPost' ? (
					detailFeed.map(item => <Post postInformations={item} key={item.id} />)
				) : (
					<Post postInformations={detailFeed} />
				)}
			</div>
		</NormalContainer>
	);
};
export default DetailFeed;
