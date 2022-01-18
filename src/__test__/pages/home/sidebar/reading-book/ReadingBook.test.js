import { render } from '@testing-library/react';
import ReadingBook from 'pages/home/components/sidebar/components/reading-book';

describe('sách đang đọc', () => {
	it('check source ảnh bìa sách', () => {
		const { getByTestId } = render(<ReadingBook />);
		const bookImg = getByTestId('reading-book__book-img');
		expect(bookImg.getAttribute('src').length).toBeGreaterThan(0);
	});

	it('check % tiến độ sách đang đọc', () => {
		const { getByText } = render(<ReadingBook />);
		const readingBookPercent = getByText('%', { exact: false }).textContent.split('%')[0];
		expect(readingBookPercent >= 0 && readingBookPercent <= 100).toBeTruthy();
	});
});
