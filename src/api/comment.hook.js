import { useDispatch } from 'react-redux';
import _ from 'lodash';

// Thay đổi lại danh sách comment sau khi đã xóa một comment
export const useHookUpdateCommentsAfterDelete = (dataDeleteCmt, type, postData, setPostData, setDataDeleteCmt) => {
	const dispatch = useDispatch();

	const updateCommentsAfterDelete = () => {
		if (!_.isEmpty(dataDeleteCmt) && type === dataDeleteCmt.type) {
			const usersComments = postData.usersComments;
			let totalCommentNumber = postData.comment;

			if (dataDeleteCmt.replyId) {
				const foundCmtParent = usersComments.find(item => item.id === dataDeleteCmt.replyId);
				if (foundCmtParent) {
					const foundCmtDelete = foundCmtParent.reply.find(item => item.id === dataDeleteCmt.id);
					if (foundCmtDelete) {
						foundCmtParent.reply.splice(foundCmtParent.reply.indexOf(foundCmtDelete), 1);
						totalCommentNumber = totalCommentNumber - 1;
					}
				}
			} else {
				const foundCmtDelete = usersComments.find(item => item.id === dataDeleteCmt.id);
				if (foundCmtDelete) {
					usersComments.splice(usersComments.indexOf(foundCmtDelete), 1);
					if (Array.isArray(foundCmtDelete.reply) && foundCmtDelete.reply.length) {
						totalCommentNumber = totalCommentNumber - 1 - foundCmtDelete.reply.length;
					} else {
						totalCommentNumber = totalCommentNumber - 1;
					}
				}
			}
			setPostData({ ...postData, comment: totalCommentNumber });
			dispatch(setDataDeleteCmt({}));
		}
	};

	return { updateCommentsAfterDelete };
};
