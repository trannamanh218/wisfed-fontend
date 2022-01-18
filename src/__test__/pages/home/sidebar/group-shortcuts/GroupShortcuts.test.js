import GroupShortcuts from 'pages/home/components/sidebar/components/group-shortcuts/index';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('test giao diện lối tắt nhóm', () => {
	it('check số lượng nhóm được hiển thị', () => {
		render(<GroupShortcuts />);
		expect(document.querySelectorAll('.group-short-cut__item').length <= 10).toBeTruthy();
	});
});

describe('check chức năng nút xem thêm/thu nhỏ lối tắt nhóm', () => {
	it('check trạng thái ban đầu', () => {
		const { getByText, getByTestId } = render(<GroupShortcuts />);
		const buttonText = getByText(/xem thêm/i);
		const buttonIcon = getByTestId('view-more-view-less-chevron');
		expect(buttonText).toBeInTheDocument();
		expect(buttonIcon.className).toContain('view-less');
	});

	it('check trạng thái đang ở chế độ thu gọn', () => {
		const { getByText, getByTestId } = render(<GroupShortcuts />);
		const buttonText = getByText(/xem thêm/i);
		const buttonIcon = getByTestId('view-more-view-less-chevron');
		userEvent.click(buttonText);
		expect(buttonText).toHaveTextContent(/thu nhỏ/i);
		expect(buttonIcon.className).toContain('view-more');
	});

	it('check trạng thái đang ở chế độ đầy đủ', () => {
		const { getByText, getByTestId } = render(<GroupShortcuts />);
		const buttonText = getByText(/xem thêm/i);
		const buttonIcon = getByTestId('view-more-view-less-chevron');
		userEvent.click(buttonText);
		userEvent.click(buttonText);
		expect(buttonText).toHaveTextContent(/xem thêm/i);
		expect(buttonIcon.className).toContain('view-less');
	});
});
