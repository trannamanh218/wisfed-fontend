import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusModalContainer from 'components/status-button/StatusModalContainer';
import { CoffeeCupIcon, TargetIcon } from 'components/svg';

describe('Status book list', () => {
	it('hiển thị đủ 3 trạng thái cuốn sách và chỉ 1 trạng thái được active', () => {
		const fakeActiveStatus = {
			'title': 'Đang đọc',
			'value': 'reading',
			'icon': CoffeeCupIcon,
		};
		const { getByText, getAllByTestId } = render(<StatusModalContainer currentStatus={fakeActiveStatus} />);

		expect(getByText(/Trạng thái cuốn sách/i)).toBeInTheDocument();
		expect(getAllByTestId('statusIcon').length).toBe(3);
		expect(document.querySelector('.status-item.status-item--icon.active')).toHaveTextContent(/Đang đọc/i);
		expect(getByText(/muốn đọc/i).parentElement).not.toHaveClass('active');
		expect(getByText(/đã đọc/i).parentElement).not.toHaveClass('active');
	});

	it('trạng thái muốn đọc phải được active', () => {
		const fakeActiveStatus = {
			'title': 'Muốn đọc',
			'value': 'wantRead',
			'icon': TargetIcon,
		};

		const { getByText } = render(<StatusModalContainer currentStatus={fakeActiveStatus} />);
		expect(getByText(/Muốn đọc/i).parentElement).toHaveClass('active');
	});

	it('phải thay đổi trạng thái cuốn sách nếu user click sang một trạng thái khác trạng thái trước đó', () => {
		const fakeActiveStatus = {
			'title': 'Đang đọc',
			'value': 'reading',
			'icon': CoffeeCupIcon,
		};
		const handleChangeStatus = jest.fn();
		const { getByText } = render(
			<StatusModalContainer currentStatus={fakeActiveStatus} handleChangeStatus={handleChangeStatus} />
		);
		const fakeTitle = 'Muốn đọc';

		const wantReadItem = getByText(fakeTitle).parentElement;
		userEvent.click(wantReadItem);

		expect(handleChangeStatus).toBeCalledTimes(1);
		expect(handleChangeStatus).toHaveBeenCalledWith(expect.objectContaining({ title: fakeTitle }));
	});

	it('should not change active status when use click same status', () => {
		const fakeActiveStatus = {
			'title': 'Đang đọc',
			'value': 'reading',
			'icon': CoffeeCupIcon,
		};
		const handleChangeStatus = jest.fn();
		const fakeTitle = /Đang đọc/i;
		const { getByText } = render(
			<StatusModalContainer currentStatus={fakeActiveStatus} handleChangeStatus={handleChangeStatus} />
		);

		const wantReadItem = getByText(fakeTitle).parentElement;
		userEvent.click(wantReadItem);

		expect(handleChangeStatus).toBeCalledTimes(0);
	});
});

describe('Book shelve list', () => {
	it('không hiển thị danh sách book shelves nếu không có dữ liệu', () => {
		const { getAllByRole } = render(<StatusModalContainer bookShelves={[]} />);

		expect(document.querySelector('.status-book__list--shelves')).not.toBeInTheDocument();
		expect(getAllByRole('list').length).toEqual(1);
	});

	it('hiển thị đúng 2 book shelve', () => {
		const fakeBookShelves = [
			{
				title: 'Sách2021',
				id: 1,
			},
			{
				title: 'tusach1',
				id: 2,
			},
		];

		const { getAllByTestId, unmount } = render(<StatusModalContainer bookShelves={fakeBookShelves} />);

		const bookShelveTitles = getAllByTestId('status-item-book-shelve').map(li => li.firstChild.textContent);
		const fakeBookShelvesTitles = fakeBookShelves.map(item => item.title);

		expect(bookShelveTitles).toEqual(fakeBookShelvesTitles);
		expect(getAllByTestId('status-item-book-shelve').length).toBe(2);
		unmount();
	});

	it('khi click nút thêm sách thì nút thêm sách sẽ ẩn đi và hiển thị ô input', async () => {
		const fakeBookShelves = [
			{
				title: 'Sách2021',
				id: 1,
			},
			{
				title: 'tusach1',
				id: 2,
			},
		];

		const { getByText, queryByText, queryByTestId, unmount } = render(
			<StatusModalContainer bookShelves={fakeBookShelves} />
		);
		const addButton = getByText(/Thêm giá sách/i);
		addButton.click();

		expect(queryByText(/Thêm giá sách/i)).toBeNull();
		expect(queryByTestId('addShelveForm')).toBeTruthy();
		unmount();
	});

	it('không update danh sách giá nếu submit blank input', async () => {
		const fakeBookShelves = [
			{
				title: 'Sách2021',
				id: 1,
			},
			{
				title: 'tusach1',
				id: 2,
			},
		];

		const { getByText, findByTestId, getAllByTestId, queryByTestId, queryByText, unmount } = render(
			<StatusModalContainer bookShelves={fakeBookShelves} />
		);
		const addButton = getByText(/Thêm giá sách/i);
		addButton.click();

		const form = await findByTestId('addShelveForm');

		await act(async () => {
			fireEvent.submit(form);
		});

		expect(getAllByTestId('status-item-book-shelve').length).toBe(2);
		expect(queryByTestId('addShelveForm')).toBeNull();
		expect(queryByText(/Thêm giá sách/i)).toBeTruthy();
		unmount();
	});

	it('update danh sách giá sách nếu thỏa mãn giá trị input không vượt quá 20 kí tự', async () => {
		const fakeBookShelves = [
			{
				title: 'Sách2021',
				id: 1,
			},
			{
				title: 'tusach1',
				id: 2,
			},
		];

		const fakeInputValue = 'tu sach thang 1/2022';

		const updateBookShelve = jest.fn();

		const { getByText, findByTestId, queryByTestId, queryByText, unmount } = render(
			<StatusModalContainer bookShelves={fakeBookShelves} updateBookShelve={updateBookShelve} />
		);
		const addButton = getByText(/Thêm giá sách/i);
		addButton.click();

		const form = await findByTestId('addShelveForm');
		const input = await findByTestId('input');
		await act(async () => {
			fireEvent.change(input, { target: { value: fakeInputValue } });
			fireEvent.submit(form);
		});

		expect(updateBookShelve).toHaveBeenCalledTimes(1);
		expect(updateBookShelve).toHaveBeenCalledWith(fakeInputValue);
		expect(queryByTestId('addShelveForm')).toBeNull();
		expect(queryByText(/Thêm giá sách/i)).toBeTruthy();
		unmount();
	});
});
