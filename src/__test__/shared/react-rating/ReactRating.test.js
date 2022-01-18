import { render } from '@testing-library/react';
import ReactRating from 'shared/react-rating';

describe('test giao diện rating', () => {
	it('test tổng số lượng sao được render', () => {
		render(<ReactRating />);
		const starNumber = document.querySelectorAll('.star-icon:not(.fill)').length;
		expect(starNumber).toBe(5);
	});
});
