import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddBookShelveForm from 'components/status-book-modal/components/add-book-shelve-form/AddBookShelveForm';
import React from 'react';
import { act } from 'react-dom/test-utils';

describe('add book shelve form', () => {
	it('hiển thị button thêm giá sách và ẩn ô input khi lần đầu tiên mở modal', () => {
		const { getByText, queryByPlaceholderText } = render(<AddBookShelveForm showInput={false} />);
		expect(getByText(/Thêm giá sách/)).toBeTruthy();
		expect(queryByPlaceholderText(/Nhập để thêm giá sách/i)).toBeNull();
	});

	it('thêm giá sách thành công nếu giá trị ô input thỏa mãn không vượt quá 20 ký tự', async () => {
		const updateBookShelve = jest.fn();
		const mockSetShowInput = jest.fn();
		const fakeInput = 'tu sach moi nhat                            ';
		const { getByTestId, queryByText, getByPlaceholderText } = render(
			<AddBookShelveForm showInput={true} updateBookShelve={updateBookShelve} setShowInput={mockSetShowInput} />
		);

		expect(queryByText(/Thêm giá sách/)).toBeNull();
		expect(getByPlaceholderText(/Nhập để thêm giá sách/i)).toBeTruthy();

		const inputElement = getByPlaceholderText(/Nhập để thêm giá sách/i);
		const formElement = getByTestId('addShelveForm');
		await act(async () => {
			fireEvent.change(inputElement, { target: { value: fakeInput } });
			fireEvent.submit(formElement);
		});

		expect(updateBookShelve).toBeCalledTimes(1);
		expect(updateBookShelve).toBeCalledWith('tu sach moi nhat');
		expect(mockSetShowInput).toBeCalledTimes(1);
	});

	it('không cập nhật giá sách nếu submit ô input trống', async () => {
		const updateBookShelve = jest.fn();
		const mockSetShowInput = jest.fn();
		const { getByTestId } = render(
			<AddBookShelveForm showInput={true} updateBookShelve={updateBookShelve} setShowInput={mockSetShowInput} />
		);

		const formElement = getByTestId('addShelveForm');
		await act(async () => {
			fireEvent.submit(formElement);
		});

		expect(updateBookShelve).toBeCalledTimes(0);
		expect(mockSetShowInput).toBeCalledTimes(1);
	});

	it('hiển thị thông báo lỗi nếu nhập ô input vượt quá 20 ký tự', async () => {
		const { getByText, getByPlaceholderText } = render(<AddBookShelveForm showInput={true} />);
		const fakeInputValue = 'krmkmlrkbmvlkmcms,fmelkmflkmelkfmlkwmflkmwlkmflkfwm';

		const inputElement = getByPlaceholderText(/Nhập để thêm giá sách/i);
		userEvent.type(inputElement, fakeInputValue);
		fireEvent.blur(inputElement);

		await waitFor(() => {
			expect(getByText(/Trường này không vượt quá 20 kí tự/i)).toBeInTheDocument();
		});
	});
});
