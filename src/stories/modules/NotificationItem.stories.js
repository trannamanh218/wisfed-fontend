import NotificationStatus from 'shared/notification-status';

export default {
	title: 'Components/Modules/Notification status',
	component: NotificationStatus,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};
const Template = args => <NotificationStatus {...args} />;

export const Default = Template.bind({});
Default.args = {
	data: {},
};

export const MyNotificationStatus = Template.bind({});
MyNotificationStatus.args = {
	data: {
		actor: 'Hoàng Thiên Quân',
		avatar: '',
		time: '2022-03-14T07:48:51.773633',
		message: '<span>Hoàng Thiên Quân</span> đã cập nhật <span> Trạng thái Review sách</span>',
		status: '',
		isAccept: false,
		isRefuse: false,
		isSeen: false,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
	},
};

export const MyNotificationStatusIlike = Template.bind({});
MyNotificationStatusIlike.args = {
	data: {
		actor: 'Đặng Đình Văn',
		avatar: '',
		time: '2022-03-14T07:48:51.773633',
		message: '<span>Đặng Đình Văn</span> đã mời bạn thích  <span> Những người yêu sách</span>',
		status: 'ilike',
		isAccept: false,
		isRefuse: false,
		isSeen: true,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
	},
};

export const MyNotificationStatusAddFriend = Template.bind({});
MyNotificationStatusAddFriend.args = {
	data: {
		actor: 'Phạm Hùng',
		avatar: '',
		time: '2022-03-10T07:48:51.773633',
		message: '<span>Phạm Hùng</span> đã gửi lời mời kết bạn',
		status: 'addfriend',
		isAccept: false,
		isRefuse: false,
		isSeen: false,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
	},
};

export const MyNotificationStatusGroup = Template.bind({});
MyNotificationStatusGroup.args = {
	data: {
		actor: 'Chuyên trộm chó',
		avatar: '',
		time: '2022-02-14T07:48:51.773633',
		message: '<span>Chuyên trộm chó</span> vừa đăng trong nhóm<span> Trộm chó chuyên nghiệp</span> ',
		status: 'browse',
		isAccept: false,
		isRefuse: false,
		isSeen: false,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
	},
};
export const MyNotificationStatusAccept = Template.bind({});
MyNotificationStatusAccept.args = {
	data: {
		actor: 'Chuyên trộm chó',
		avatar: '',
		time: '2022-02-14T07:48:51.773633',
		message: '<span>Chuyên trộm chó</span> vừa đăng trong nhóm<span> Trộm chó chuyên nghiệp</span> ',
		status: 'browse',
		isAccept: true,
		isRefuse: false,
		isSeen: true,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
	},
};
export const MyNotificationStatusRefuse = Template.bind({});
MyNotificationStatusRefuse.args = {
	data: {
		actor: 'Chuyên trộm chó',
		avatar: '',
		time: '2022-02-14T07:48:51.773633',
		message: '<span>Chuyên trộm chó</span> vừa đăng trong nhóm<span> Trộm chó chuyên nghiệp</span> ',
		status: 'browse',
		isAccept: false,
		isRefuse: true,
		isSeen: true,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
	},
};
