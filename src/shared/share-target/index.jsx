import { useSelector } from 'react-redux';
import LinearProgressBar from 'shared/linear-progress-bar';
import UserAvatar from 'shared/user-avatar';
import './index.scss';

function ShareTarget({ postsData }) {
	const { userInfo } = useSelector(state => state.auth);

	const renderContentTop = () => {
		return (
			<div className='reading-target__content__top'>
				<p>
					Bạn đã đọc được {postsData?.booksReadCount} trên {postsData?.numberBook} cuốn
				</p>
			</div>
		);
	};

	return (
		<div className='creat-post-modal-content__main__share-container'>
			<div className='reading-target__process'>
				<UserAvatar className='reading-target__user' source={userInfo?.avatarImage} size='lg' />
				<div className='reading-target__content'>
					{renderContentTop()}
					<div className='reading-target__content__bottom'>
						<LinearProgressBar percent={postsData?.percent} label={`${postsData?.percent} %`} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default ShareTarget;
