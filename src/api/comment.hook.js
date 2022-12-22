import { useDispatch } from 'react-redux';
import _ from 'lodash';

// Thay đổi lại comment sau khi đã chỉnh sửa hoặc xóa
export const useHookUpdateCommentsAfterEditing = (paramHandleEdit, type, postData, setPostData, setParamHandleEdit) => {
	const dispatch = useDispatch();

	const handleUpdateCommentsAfterEditing = () => {
		if (!_.isEmpty(paramHandleEdit) && type === paramHandleEdit.type) {
			const cloneArr = [...postData.usersComments];
			let totalCommentNumber = postData.comment;

			if (paramHandleEdit.replyId) {
				const foundReplyObj = cloneArr.find(item => item.id === paramHandleEdit.replyId);
				if (foundReplyObj) {
					const cloneReplyArr = [...foundReplyObj.reply];
					const foundObj = cloneReplyArr.find(item => item.id === paramHandleEdit.id);
					if (foundObj) {
						if (paramHandleEdit.content) {
							const cloneFoundObj = { ...foundObj };
							cloneFoundObj.content = paramHandleEdit.content;
							cloneReplyArr[cloneReplyArr.indexOf(foundObj)] = cloneFoundObj;

							const cloneFoundReplyObj = { ...foundReplyObj };
							cloneFoundReplyObj.reply = cloneReplyArr;
							cloneArr[cloneArr.indexOf(foundReplyObj)] = cloneFoundReplyObj;
						} else {
							cloneReplyArr.splice(cloneReplyArr.indexOf(foundObj), 1);
							foundReplyObj.reply = cloneReplyArr;
							totalCommentNumber = totalCommentNumber - 1;
						}
					}
				}
			} else {
				const foundObj = cloneArr.find(item => item.id === paramHandleEdit.id);
				if (foundObj) {
					if (paramHandleEdit.content) {
						const cloneFoundObj = { ...foundObj };
						cloneFoundObj.content = paramHandleEdit.content;
						cloneArr[cloneArr.indexOf(foundObj)] = cloneFoundObj;
					} else {
						cloneArr.splice(cloneArr.indexOf(foundObj), 1);
						if (Array.isArray(foundObj.reply) && foundObj.reply.length) {
							totalCommentNumber = totalCommentNumber - 1 - foundObj.reply.length;
						} else {
							totalCommentNumber = totalCommentNumber - 1;
						}
					}
				}
			}
			setPostData({ ...postData, comment: totalCommentNumber, usersComments: cloneArr });
			dispatch(setParamHandleEdit({}));
		}
	};

	return { handleUpdateCommentsAfterEditing };
};
