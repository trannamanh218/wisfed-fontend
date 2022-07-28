import { useState, useEffect } from 'react';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import './comment-editor.scss';
import { useSelector, useDispatch } from 'react-redux';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import RichTextEditor from 'shared/rich-text-editor';
import Storage from 'helpers/Storage';

const CommentEditor = ({
	onCreateComment,
	className,
	mentionUsersArr,
	commentLv1Id,
	replyingCommentId,
	clickReply,
	setMentionUsersArr,
}) => {
	const [content, setContent] = useState('');
	const [createCmt, setCreateCmt] = useState(true);

	const dispatch = useDispatch();
	const userInfo = useSelector(state => state.auth.userInfo);

	useEffect(() => {
		if (replyingCommentId === commentLv1Id) {
			const commentEditField = document.querySelector(`.reply-comment-${commentLv1Id}`);
			if (commentEditField) {
				setTimeout(() => {
					window.scroll({
						top: commentEditField.offsetTop - 400,
						behavior: 'smooth',
					});
				}, 200);
			}
		}
	}, [clickReply]);

	const handleKeyBind = e => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			if (e.keyCode === 13 && !e.shiftKey && !(e.metaKey || e.ctrlKey)) {
				return 'send-message';
			} else if (e.keyCode === 13 && e.shiftKey) {
				return 'split-block';
			}
		}
	};

	const handleKeyPress = command => {
		if (command === 'send-message') {
			onCreateComment(content, commentLv1Id);
			setCreateCmt(!createCmt);
		}
	};

	return (
		<>
			<div className={`comment-editor ${className ? className : ''}`}>
				<div className='comment-editor__avatar'>
					<UserAvatar size='sm' source={userInfo.avatarImage} />
				</div>
				<RichTextEditor
					placeholder='Viết bình luận...'
					className={commentLv1Id ? `rich-text-editor-${commentLv1Id}` : ''}
					content={content}
					setContent={setContent}
					handleKeyBind={handleKeyBind}
					handleKeyPress={handleKeyPress}
					createCmt={createCmt}
					mentionUsersArr={mentionUsersArr}
					hasMentionsUser={true}
					setMentionUsersArr={setMentionUsersArr}
					commentLv1Id={commentLv1Id}
					replyingCommentId={replyingCommentId}
					clickReply={clickReply}
				/>
			</div>
		</>
	);
};

CommentEditor.defaultProps = {
	onCreateComment: () => {},
	className: '',
	commentLv1Id: null,
	replyingCommentId: -1,
	mentionUsersArr: [],
	clickReply: false,
	setMentionUsersArr: () => {},
};

CommentEditor.propTypes = {
	onCreateComment: PropTypes.func,
	className: PropTypes.string,
	commentLv1Id: PropTypes.number,
	replyingCommentId: PropTypes.number,
	mentionUsersArr: PropTypes.array,
	clickReply: PropTypes.bool,
	setMentionUsersArr: PropTypes.func,
};

export default CommentEditor;
