import PostActionBar from 'shared/post-action-bar';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('test chức năng nút like', () => {
	it('test khi chưa thích', () => {
		const postItem = {
			id: 3,
			userAvatar: 'abc.jpg',
			userName: 'Trần Văn Đức',
			bookImage: 'deg.jpg',
			bookName: 'House of the Witch',
			isLike: false,
			likeNumber: 6,
		};
		const likeAction = jest.fn(param => {
			if (param.isLike) {
				param.isLike = false;
				param.likeNumber--;
			} else {
				param.isLike = true;
				param.likeNumber++;
			}
			return param;
		});
		const { getByTestId } = render(<PostActionBar postInformations={postItem} likeAction={likeAction} />);
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
			likeNumber: 7,
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
			likeNumber: 6,
		};
		const likeAction = jest.fn(param => {
			if (param.isLike) {
				param.isLike = false;
				param.likeNumber -= 1;
			} else {
				param.isLike = true;
				param.likeNumber += 1;
			}
			return param;
		});
		const { getByTestId } = render(<PostActionBar postInformations={postItem} likeAction={likeAction} />);
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
			likeNumber: 5,
		});
	});
});
