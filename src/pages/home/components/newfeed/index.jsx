import DropdownIconButton from 'components/dropdown-status-book';
import StatusBookModal from 'components/status-book-modal';
import React from 'react';
import './newfeed.scss';

const NewFeed = () => {
	return (
		<div className='newfeed'>
			<p>
				Distinctio, aliquid voluptas iure autem nostrum nesciunt, quidem vero quaerat magnam quibusdam aut.
				Libero similique assumenda nesciunt iste, voluptas dolore. Dolorem autem odit atque pariatur deserunt
				illum repellendus corporis itaque dolores! Placeat, repellat ipsam quisquam veniam ab dolor ut
				perferendis expedita consequatur. Temporibus nam, nobis harum natus aspernatur aliquid maiores.
			</p>
			<DropdownIconButton></DropdownIconButton>
			<br />
			<StatusBookModal />
		</div>
	);
};

export default NewFeed;
