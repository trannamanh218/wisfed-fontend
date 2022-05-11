import { useRef } from 'react';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import './comment-editor.scss';

const CommentEditor = ({ userInfo, onCreateComment, className, replyId, textareaId }) => {
	const commentArea = useRef(null);

	const onChangeComment = () => {
		commentArea.current.style.height = 0;
		commentArea.current.style.height = commentArea.current.scrollHeight + 2 + 'px';
	};

	const handleKeyPress = e => {
		if (e.which === 13 && !e.shiftKey && commentArea.current.value) {
			e.preventDefault();
			onCreateComment(commentArea.current.value, replyId);
			commentArea.current.value = '';
			onChangeComment();
		}
	};

	return (
		<div className={`comment-editor ${className ? className : ''}`}>
			<div className='comment-editor__avatar'>
				<UserAvatar size='sm' source={userInfo.avatarImage} />
			</div>
			<form className='comment-editor__form'>
				<textarea
					ref={commentArea}
					className='comment-editor__textarea'
					placeholder='Viết bình luận...'
					rows='1'
					onChange={onChangeComment}
					name='content'
					id={textareaId}
					onKeyPress={handleKeyPress}
				/>
			</form>
		</div>
	);
};

CommentEditor.defaultProps = {
	userInfo: {},
	onCreateComment: () => {},
	className: '',
	replyId: null,
};

CommentEditor.propTypes = {
	userInfo: PropTypes.object,
	onCreateComment: PropTypes.func,
	className: PropTypes.string,
	replyId: PropTypes.any,
	textareaId: PropTypes.string,
};

export default CommentEditor;
