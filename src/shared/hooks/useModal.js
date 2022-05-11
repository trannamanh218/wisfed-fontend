import { useState } from 'react';

function useModal(initialValue) {
	const [modalOpen, setModalOpen] = useState(initialValue);

	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	return { modalOpen, setModalOpen, toggleModal };
}

export default useModal;
