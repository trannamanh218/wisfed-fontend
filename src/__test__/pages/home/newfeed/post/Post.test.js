import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Post from 'pages/home/components/newfeed/components/post';

describe('check thông tin người đăng bài', () => {
	it('check source user avatar', () => {
		const postItem = {
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: true,
			likes: 6,
		};
		const { getByTestId } = render(<Post postInformations={postItem} />);
		const avatar = getByTestId('post__user-avatar');
		expect(avatar.getAttribute('src').length).toBeGreaterThan(0);
	});

	it('check user name', () => {
		const postItem = {
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: true,
			likes: 6,
		};
		const { getByTestId } = render(<Post postInformations={postItem} />);
		expect(getByTestId('post__user-name').textContent.length).toBeGreaterThan(0);
	});
});

describe('check thông tin sách trong bài đăng', () => {
	it('check source book image', () => {
		const postItem = {
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: true,
			likes: 6,
		};
		const { getByTestId } = render(<Post postInformations={postItem} />);
		const bookImg = getByTestId('post__book__image');
		expect(bookImg.getAttribute('src').length).toBeGreaterThan(0);
	});

	it('check user name', () => {
		const postItem = {
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: true,
			likes: 6,
		};
		const { getByTestId } = render(<Post postInformations={postItem} />);
		expect(getByTestId('post__book__name').textContent.length).toBeGreaterThan(0);
	});
});

describe('test chức năng nút like', () => {
	it('test khi chưa thích', () => {
		const postItem = {
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: false,
			likes: 6,
		};
		const likeAction = jest.fn(param => {
			if (param.isLike) {
				param.isLike = false;
				param.likes--;
			} else {
				param.isLike = true;
				param.likes++;
			}
			return param;
		});
		const { getByTestId } = render(<Post postInformations={postItem} likeAction={likeAction} />);
		const likeBtn = getByTestId('post__options__like-btn');
		userEvent.click(likeBtn);
		expect(likeAction).toBeCalledWith(postItem);
		expect(likeAction).toHaveReturnedWith({
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: true,
			likes: 7,
		});
	});

	it('test khi đã thích', () => {
		const postItem = {
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: true,
			likes: 6,
		};
		const likeAction = jest.fn(param => {
			if (param.isLike) {
				param.isLike = false;
				param.likes -= 1;
			} else {
				param.isLike = true;
				param.likes += 1;
			}
			return param;
		});
		const { getByTestId } = render(<Post postInformations={postItem} likeAction={likeAction} />);
		const likeBtn = getByTestId('post__options__like-btn');
		userEvent.click(likeBtn);
		expect(likeAction).toBeCalledWith(postItem);
		expect(likeAction).toHaveReturnedWith({
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: false,
			likes: 5,
		});
	});
});
