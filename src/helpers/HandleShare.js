import Button from 'shared/button';
import { Add, Minus } from 'components/svg';

export const renderMessage = item => {
	if (item.verb === 'addfriend') {
		return 'đã gửi lời mời kết bạn';
	} else if (item.verb === 'commentMinipost') {
		return 'đã bình luận vào bài viết của bạn';
	} else if (item.verb === 'browse') {
		return (
			<>
				vừa đăng trong nhóm <span>{item?.group}</span>
			</>
		);
	} else if (item.verb === 'ilike') {
		return (
			<>
				đã mời bạn thích <span>{item?.group}</span>
			</>
		);
	}
};

export const buttonReqFriend = () => {
	return (
		<Button className='connect-button' isOutline={true} name='friend'>
			<Minus className='connect-button__icon' />
			<span className='connect-button__content'>Đã gửi lời mời</span>
		</Button>
	);
};
