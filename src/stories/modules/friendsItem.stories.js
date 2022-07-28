import FriendsItem from 'shared/friends';

export default {
	title: 'Components/Modules/Friends Item',
	component: FriendsItem,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};
const Template = args => <FriendsItem {...args} />;

export const MyFriend = Template.bind({});
MyFriend.args = {
	data: {
		createdAt: '2022-04-01T09:34:48.487Z',
		id: 34,
		isFriends: true,
		updatedAt: '2022-04-01T09:34:48.487Z',
		userIdOne: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
		userIdTwo: 'ba755e87-f714-4542-a768-363bd0976215',
		userOne: {
			avatarImage: 'http://192.168.3.10:31989/api/v1/files/streaming/images/file-1648785882792.png',
			email: 'register@gmail.com',
			firstName: 'Quân',
			fullName: 'Quân User',
			id: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
			lastName: 'User',
		},
		userTwo: {
			avatarImage: null,
			email: 'hungngonzai@gmail.com',
			firstName: 'MSI',
			fullName: 'MSI Franky',
			id: 'ba755e87-f714-4542-a768-363bd0976215',
			lastName: 'Franky',
		},
	},
};

export const Follow = Template.bind({});
Follow.args = {
	data: {
		createdAt: '2022-04-01T09:34:48.487Z',
		id: 34,
		isFollow: true,
		isFriends: false,
		isPending: false,
		updatedAt: '2022-04-01T09:34:48.487Z',
		userIdOne: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
		userIdTwo: 'ba755e87-f714-4542-a768-363bd0976215',
		userOne: {
			avatarImage: 'http://192.168.3.10:31989/api/v1/files/streaming/images/file-1648785882792.png',
			email: 'register@gmail.com',
			firstName: 'Quân',
			fullName: 'Quân User',
			id: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
			lastName: 'User',
		},
		userTwo: {
			avatarImage: null,
			email: 'hungngonzai@gmail.com',
			firstName: 'Đặng',
			fullName: 'Đặng Văn',
			id: 'ba755e87-f714-4542-a768-363bd0976215',
			lastName: 'Văn',
		},
	},
};

export const Pending = Template.bind({});
Pending.args = {
	data: {
		createdAt: '2022-04-01T09:34:48.487Z',
		id: 34,
		isPending: true,
		isFriends: false,
		isFollow: true,
		updatedAt: '2022-04-01T09:34:48.487Z',
		userIdOne: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
		userIdTwo: 'ba755e87-f714-4542-a768-363bd0976215',
		userOne: {
			avatarImage: 'http://192.168.3.10:31989/api/v1/files/streaming/images/file-1648785882792.png',
			email: 'register@gmail.com',
			firstName: 'Quân',
			fullName: 'Quân User',
			id: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
			lastName: 'User',
		},
		userTwo: {
			avatarImage: null,
			email: 'hungngonzai@gmail.com',
			firstName: 'Thiên',
			fullName: 'Thiên Quân',
			id: 'ba755e87-f714-4542-a768-363bd0976215',
			lastName: 'Quân',
		},
	},
};

export const FollowAndFriend = Template.bind({});
FollowAndFriend.args = {
	data: {
		createdAt: '2022-04-01T09:34:48.487Z',
		id: 34,
		isFriends: true,
		isFollow: true,
		isStar: true,
		updatedAt: '2022-04-01T09:34:48.487Z',
		userIdOne: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
		userIdTwo: 'ba755e87-f714-4542-a768-363bd0976215',
		userOne: {
			avatarImage: 'http://192.168.3.10:31989/api/v1/files/streaming/images/file-1648785882792.png',
			email: 'register@gmail.com',
			firstName: 'Văn',
			fullName: 'Văn User',
			id: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
			lastName: 'User',
		},
		userTwo: {
			avatarImage: null,
			email: 'hungngonzai@gmail.com',
			firstName: 'Hùng',
			fullName: 'Hùng Điếc',
			id: 'ba755e87-f714-4542-a768-363bd0976215',
			lastName: 'Điếc',
		},
	},
};
