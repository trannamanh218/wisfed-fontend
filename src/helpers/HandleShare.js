import Button from 'shared/button';
import { Minus } from 'components/svg';

export const renderMessage = item => {
	if (item.verb === 'addfriend' || item.verb === 'addFriend') {
		return 'đã gửi lời mời kết bạn';
	} else if (item.verb === 'browse') {
		return (
			<>
				vừa đăng trong nhóm <span>{item?.group}</span>
			</>
		);
	} else if (item.verb === 'like') {
		return (
			<>
				đã mời bạn thích <span>{item?.group}</span>
			</>
		);
	} else if (item.verb === 'mention') {
		return <>Đã nhắc bạn trong một bình luận</>;
	} else if (item.verb === 'comment') {
		return 'đã bình luận vào bài viết của bạn';
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
