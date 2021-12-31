import DropdownIconButton from '..';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Dropdown button custom', () => {
	it('menu should be render multiple items when click once', async () => {
		render(<DropdownIconButton />);
		const buttonElement = await screen.findByRole('button');
		expect(buttonElement).toBeInTheDocument();
		fireEvent.click(buttonElement);

		const liItems = await screen.queryAllByRole('listitem');
		expect(liItems.length).toBe(3);
	});

	it('menu should be disappear when user double click', async () => {
		render(<DropdownIconButton />);
		const buttonElement = await screen.findByRole('button');
		fireEvent.click(buttonElement);
		fireEvent.click(buttonElement);

		const ulElement = await screen.queryByRole('list');
		expect(ulElement).not.toBeInTheDocument();
	});
});
