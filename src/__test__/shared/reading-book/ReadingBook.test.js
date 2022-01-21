import { render } from '@testing-library/react';
import ReadingBook from 'shared/reading-book';

describe('sách đang đọc', () => {
	it('check source ảnh bìa sách', () => {
		const { getByTestId } = render(
			<ReadingBook
				bookData={{
					avatar: '/images/book1.jpg',
					name: 'Những phát minh của nhà khoa học Tesla ',
					author: 'Đỗ Gia',
				}}
				percent={30}
			/>
		);
		const bookImg = getByTestId('reading-book__book-img');
		expect(bookImg.getAttribute('src').length).toBeGreaterThan(0);
	});

	it('check % tiến độ sách đang đọc', () => {
		const { getByText } = render(<ReadingBook />);
		const readingBookPercent = getByText('%', { exact: false }).textContent.split('%')[0];
		expect(readingBookPercent >= 0 && readingBookPercent <= 100).toBeTruthy();
	});
});
