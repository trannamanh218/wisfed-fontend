import { render } from '@testing-library/react';
import Post from 'shared/post';

describe('check thông tin người đăng bài', () => {
	it('check source user avatar', () => {
		const postItem = {
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: true,
			likeNumber: 6,
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
			likeNumber: 6,
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
			likeNumber: 6,
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
			likeNumber: 6,
		};
		const { getByTestId } = render(<Post postInformations={postItem} />);
		expect(getByTestId('post__book__name').textContent.length).toBeGreaterThan(0);
	});
});
