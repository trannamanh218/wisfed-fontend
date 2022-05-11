import { render } from '@testing-library/react';
import ReadChallenge from 'shared/read-challenge';
import userEvent from '@testing-library/user-event';

describe('check các trường hợp khi nhập đầu vào ô input thử thách đọc', () => {
	it('check độ dài số cuốn sách thử thách đọc', () => {
		const { getByTestId } = render(<ReadChallenge />);
		const inputValue = getByTestId('read-challenge__input').value;
		expect(inputValue >= 0 && inputValue <= 999).toBeTruthy();
	});

	it('khi nhập số thập phân phải trả về số nguyên bé hơn', () => {
		const { getByTestId } = render(<ReadChallenge />);
		const input = getByTestId('read-challenge__input');
		userEvent.type(input, '2.9');
		expect(input.value).toBe('2');
	});

	it('khi nhập số thập phân phải trả về số nguyên bé hơn', () => {
		const { getByTestId } = render(<ReadChallenge />);
		const input = getByTestId('read-challenge__input');
		userEvent.type(input, '10.1');
		expect(input.value).toBe('10');
	});
});

describe('check chức năng các nút trong phần thử thách đọc', () => {
	it('check chức năng nút tăng thử thách thêm 1', () => {
		const { getByTestId } = render(<ReadChallenge />);
		const input = getByTestId('read-challenge__input');
		userEvent.type(input, '10');
		const increaseBtn = getByTestId('read-challenge__increase-btn');
		userEvent.click(increaseBtn);
		expect(input.value).toBe('11');
	});

	it('check chức năng nút giảm thử thách đi 1', () => {
		const { getByTestId } = render(<ReadChallenge />);
		const input = getByTestId('read-challenge__input');
		userEvent.type(input, '10');
		const decreaseBtn = getByTestId('read-challenge__decrease-btn');
		userEvent.click(decreaseBtn);
		expect(input.value).toBe('9');
	});
});
