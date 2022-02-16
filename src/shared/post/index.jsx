import './post.scss';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import PostBook from 'shared/post-book';
import PostActionBar from 'shared/post-action-bar';
import classNames from 'classnames';

function Post({ postInformations, likeAction, className }) {
	const [commentContent, setCommentContent] = useState('');

	const commentArea = useRef(null);

	const updateCommentCotent = e => {
		setCommentContent(e.target.value);
		commentArea.current.style.height = 0;
		commentArea.current.style.height = commentArea.current.scrollHeight + 2 + 'px';
	};

	return (
		<div className={classNames('post__container', { [`${className}`]: className })}>
			<div className='post__user-status'>
				<div className='post__user-status__avatar'>
					<img data-testid='post__user-avatar' src={postInformations.userAvatar} alt='' />
				</div>
				<div className='post__user-status__name-and-post-time-status'>
					<div data-testid='post__user-name' className='post__user-status__name'>
						{postInformations.userName}
					</div>
					<div className='post__user-status__post-time-status'>
						<span>1 giờ trước</span>
						<div className='post__user-status__post-time-status__online-dot'></div>
						<span style={{ color: '#656773' }}>Cập nhật tiến độ đọc sách</span>
					</div>
				</div>
			</div>
			<div className='post__description'>Saw this place today, it looks even better in-person!</div>

			{postInformations.bookImage !== '' && <PostBook postInformations={postInformations} />}
			<PostActionBar postInformations={postInformations} likeAction={likeAction} />
			<div className='post__comments-box'>
				<div className='post__comments-box__avatar'>
					<img src={postInformations.userAvatar} alt='' />
				</div>
				<textarea
					ref={commentArea}
					className='post__comments-box__comment-area'
					placeholder='Viết bình luận...'
					rows='1'
					value={commentContent}
					onChange={updateCommentCotent}
				/>
			</div>
		</div>
	);
}
Post.propTypes = {
	postInformations: PropTypes.object,
	likeAction: PropTypes.func,
	className: PropTypes.string,
};

export default Post;
