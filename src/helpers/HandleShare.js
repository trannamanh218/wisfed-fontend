export const renderMessage = item => {
	if (item.verb === 'addfriend') {
		return 'đã gửi lời mời kết bạn';
	} else if (item.verb === 'commentMinipost') {
		return 'đã bình luận vào bài viết của bạn';
	}
};
