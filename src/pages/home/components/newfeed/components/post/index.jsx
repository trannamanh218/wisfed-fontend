import './post.scss';
import PropTypes from 'prop-types';
import { Like, Comment, Share, LikeFill } from 'components/svg';
import { useState, useRef } from 'react';
import PostBook from 'pages/home/components/newfeed/components/post-book';
function Post({ postInformations, likeAction }) {
	const [commentContent, setCommentContent] = useState('');

	const commentArea = useRef(null);

	const updateCommentCotent = e => {
		setCommentContent(e.target.value);
		commentArea.current.style.height = 0;
		commentArea.current.style.height = commentArea.current.scrollHeight + 2 + 'px';
	};

	return (
		<div className='post__container'>
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

			<div className='post__options'>
				<div
					data-testid='post__options__like-btn'
					className='post__options__item '
					onClick={() => likeAction(postInformations)}
				>
					{postInformations.isLike ? <LikeFill /> : <Like />}
					<div className='post__options__action-name'>{postInformations.likes} Thích</div>
				</div>
				<div className='post__options__item'>
					<Comment />
					<div className='post__options__action-name'>7 Bình luận</div>
				</div>
				<div className='post__options__item'>
					<Share />
					<div className='post__options__action-name'>54 Chia sẻ</div>
				</div>
				{/* <div className='post__options__item'>
					<ActionPlus />
					<div className='post__options__action-name'>10 Add sách</div>
				</div> */}
			</div>
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
};

export default Post;
