import { useFetchActivities } from 'api/activity.hooks';
import Post from 'shared/post';
import './post-tab.scss';

function PostTab() {
	const { activity: postList } = useFetchActivities(0, 10, '[]');

	return (
		<div className='post-tab'>
			{postList.length > 0 && postList.map(item => <Post key={item.id} postInformations={item} />)}
		</div>
	);
}

export default PostTab;
