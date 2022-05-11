import { render } from '@testing-library/react';
import CreatePost from 'pages/home/components/newfeed/components/creat-post';

describe('check giao diện tạo bài viết', () => {
	it('check source user avatar', () => {
		const { getByTestId } = render(<CreatePost />);
		const avatar = getByTestId('creat-post__user-avatar');
		expect(avatar.getAttribute('src').length).toBeGreaterThan(0);
	});

	it('check sự tồn tại của ô input', () => {
		const { getByPlaceholderText } = render(<CreatePost />);
		expect(getByPlaceholderText(/tạo bài viết của bạn/i)).toBeInTheDocument();
	});

	it('check sự tồn tại của các tùy chọn tạo bài viết', () => {
		const { getByText } = render(<CreatePost />);
		expect(getByText(/Sách/)).toBeInTheDocument();
		expect(getByText(/Tác giả/)).toBeInTheDocument();
		expect(getByText(/Chủ đề/)).toBeInTheDocument();
		expect(getByText(/Hashtag/)).toBeInTheDocument();
	});
});
