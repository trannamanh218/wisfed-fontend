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
	hideAvatar,
	initialContent,
	isEditCmt,
}) => {
	const [content, setContent] = useState('');
	const [createCmt, setCreateCmt] = useState(true);

	const dispatch = useDispatch();
	const userInfo = useSelector(state => state.auth.userInfo);

	useEffect(() => {
		if (replyingCommentId === commentLv1Id) {
			const commentEditField = document.querySelector(`.reply-comment-${commentLv1Id}`);

			let number = 400;
			if (window.location.pathname.includes('profile/')) {
				number = -400;
			} else if (window.location.pathname.includes('category/detail/')) {
				number = -600;
			}
			if (commentEditField) {
				setTimeout(() => {
					window.scroll({
						top: commentEditField.offsetTop - number,
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
			if (!isEditCmt) {
				setCreateCmt(!createCmt);
			}
		}
	};

	return (
		<>
			<div className={`comment-editor ${className ? className : ''}`}>
				{!hideAvatar && (
					<div className='comment-editor__avatar'>
						<UserAvatar size='sm' source={userInfo.avatarImage} />
					</div>
				)}
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
					initialContent={initialContent}
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
	hideAvatar: false,
	isEditCmt: false,
};

CommentEditor.propTypes = {
	onCreateComment: PropTypes.func,
	className: PropTypes.string,
	commentLv1Id: PropTypes.number,
	replyingCommentId: PropTypes.number,
	mentionUsersArr: PropTypes.array,
	clickReply: PropTypes.bool,
	setMentionUsersArr: PropTypes.func,
	hideAvatar: PropTypes.bool,
	initialContent: PropTypes.string,
	isEditCmt: PropTypes.bool,
};

export default CommentEditor;
