import NormalContainer from 'components/layout/normal-container';
import Post from 'shared/post';
import { getDetailFeed } from 'reducers/redux-utils/notificaiton';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import './detail-feed.scss';

const DetailFeed = () => {
	const dispatch = useDispatch();
	const [detailFeed, setDetailFedd] = useState([]);

	const { idPost } = useParams();

	useEffect(async () => {
		const params = {
			id: idPost,
		};

		try {
			const res = await dispatch(getDetailFeed(params)).unwrap();
			setDetailFedd(res);
		} catch (err) {
			NotificationError(err);
		}
	}, []);

	return (
		<NormalContainer>
			<div className='detail_feed_container'>
				{detailFeed.map(item => (
					<Post postInformations={item} key={item.id} />
				))}
			</div>
		</NormalContainer>
	);
};
export default DetailFeed;
