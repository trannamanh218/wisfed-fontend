import group from 'reducers/redux-utils/group';
import NotificationStatus from 'shared/notification-status';

export default {
	title: 'Components/Modules/Notification status',
	component: NotificationStatus,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};
const Template = args => <NotificationStatus {...args} />;

export const MyNotificationStatus = Template.bind({});
MyNotificationStatus.args = {
	item: {
		actor: '77177554-2322-41d3-8bb3-1335aa906c25',
		createdBy: {
			firstName: 'Test',
			lastName: 'Gao',
			avatarImage: null,
			email: 'register2@gmail.com',
			id: '77177554-2322-41d3-8bb3-1335aa906c25',
		},
		isAccept: false,
		isRead: false,
		isRefuse: false,
		message: "<span>Test Gao</span> đã theo dõi bạn it's awesome!",
		verb: 'follow',
		time: '2022-03-24T08:03:39.868360',
	},
};

export const MyNotificationStatusIlike = Template.bind({});
MyNotificationStatusIlike.args = {
	item: {
		actor: '1b1df96b-a88a-41a4-a467-062286169abe',
		createdBy: {
			firstName: 'Nguyễn ',
			lastName: 'Văn Đức',
			avatarImage: null,
			email: 'register2@gmail.com',
			id: '77177554-2322-41d3-8bb3-1335aa906c25',
		},
		time: '2022-03-14T07:48:51.773633',
		message: '',
		isAccept: false,
		isRefuse: false,
		isRead: false,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		verb: 'ilike',
		group: 'Những người yêu sách',
	},
};

export const MyNotificationStatusAddFriend = Template.bind({});
MyNotificationStatusAddFriend.args = {
	item: {
		actor: '1b1df96b-a88a-41a4-a467-062286169abe',
		createdBy: {
			firstName: 'Đặng',
			lastName: 'Đình Văn',
			avatarImage: null,
			email: 'register2@gmail.com',
			id: '77177554-2322-41d3-8bb3-1335aa906c25',
		},
		time: '2022-03-14T07:48:51.773633',
		message: '',
		status: 'ilike',
		isAccept: false,
		isRefuse: false,
		isRead: true,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		verb: 'addfriend',
	},
};

export const MyNotificationStatusGroup = Template.bind({});
MyNotificationStatusGroup.args = {
	item: {
		actor: '1b1df96b-a88a-41a4-a467-062286169abe',
		createdBy: {
			firstName: 'Chuyên',
			lastName: 'trộm chó',
			avatarImage: null,
			email: 'register2@gmail.com',
			id: '77177554-2322-41d3-8bb3-1335aa906c25',
		},
		avatar: '',
		time: '2022-02-14T07:48:51.773633',
		message: '',
		isAccept: false,
		isRefuse: false,
		isRead: false,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		verb: 'browse',
		group: 'Trộm chó chuyên nghiệp',
	},
};
export const MyNotificationStatusAccept = Template.bind({});
MyNotificationStatusAccept.args = {
	item: {
		actor: '1b1df96b-a88a-41a4-a467-062286169abe',
		createdBy: {
			firstName: 'Chuyên',
			lastName: 'trộm chó',
			avatarImage: null,
			email: 'register2@gmail.com',
			id: '77177554-2322-41d3-8bb3-1335aa906c25',
		},
		avatar: '',
		time: '2022-02-14T07:48:51.773633',
		message: '',
		isAccept: true,
		isRefuse: false,
		isRead: true,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		verb: 'browse',
		group: 'Trộm chó chuyên nghiệp',
	},
};
export const MyNotificationStatusRefuse = Template.bind({});
MyNotificationStatusRefuse.args = {
	item: {
		actor: '1b1df96b-a88a-41a4-a467-062286169abe',
		createdBy: {
			firstName: 'Chuyên',
			lastName: 'trộm chó',
			avatarImage: null,
			email: 'register2@gmail.com',
			id: '77177554-2322-41d3-8bb3-1335aa906c25',
		},
		avatar: '',
		time: '2022-02-14T07:48:51.773633',
		message: '',
		isAccept: false,
		isRefuse: true,
		isRead: true,
		id: '30d4ff84-a36b-11ec-a781-02d3e6f91508',
		origin: 'user:bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		verb: 'browse',
		group: 'Trộm chó chuyên nghiệp',
	},
};
