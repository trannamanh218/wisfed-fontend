import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';

export default function WithFriends({ data }) {
	const navigate = useNavigate();

	const [showModalOthers, setShowModalOthers] = useState(false);
	const handleCloseModalOthers = () => setShowModalOthers(false);
	const handleShowModalOthers = () => setShowModalOthers(true);

	const onClickUserInModalOthers = paramItem => {
		handleCloseModalOthers();
		navigate(`/profile/${paramItem.userId}`);
	};

	if (data.length === 1) {
		return (
			<span>
				<span style={{ fontWeight: '500', color: '#6E7191' }}> cùng với </span>
				<Link to={`/profile/${data[0].userId}`}>
					{data[0].users.fullName || data[0].users.firstName + ' ' + data[0].users.lastName}
				</Link>
			</span>
		);
	} else if (data.length === 2) {
		return (
			<span>
				<span style={{ fontWeight: '500', color: '#6E7191' }}> cùng với </span>
				<Link to={`/profile/${data[0].userId}`}>
					{data[0].users.fullName || data[0].users.firstName + ' ' + data[0].users.lastName}
				</Link>
				<span style={{ fontWeight: '500', color: '#6E7191' }}> và </span>
				<Link to={`/profile/${data[1].userId}`}>
					{data[1].users.fullName || data[1].users.firstName + ' ' + data[1].users.lastName}
				</Link>
			</span>
		);
	} else {
		return (
			<span>
				<span style={{ fontWeight: '500', color: '#6E7191' }}> cùng với </span>
				<Link to={`/profile/${data[0].users.id}`}>
					{data[0].users.fullName || data[0].users.firstName + ' ' + data[0].users.lastName}
				</Link>
				<span style={{ fontWeight: '500', color: '#6E7191' }}> và </span>
				<span className='post__user__container__mention-users-plus' onClick={handleShowModalOthers}>
					<span>{data.length - 1} người khác</span>
					<div className='post__user__container__list-mention-users'>
						{!!data.length && (
							<>
								{data.slice(1).map((item, index) => (
									<div className='post__user__container__list-mention-users__name' key={index}>
										{item.users.fullName || item.users.firstName + ' ' + item.users.lastName}
									</div>
								))}
							</>
						)}
					</div>
				</span>
				<Modal show={showModalOthers} onHide={handleCloseModalOthers} className='modal-tagged-others'>
					<Modal.Header closeButton>
						<Modal.Title>Mọi người</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{!!data.length && (
							<>
								{data.slice(1).map((item, index) => (
									<div key={index} style={{ marginBottom: '1rem' }}>
										<img
											onClick={() => onClickUserInModalOthers(item)}
											className='modal-tagged-others__avatar'
											src={item.users.avatarImage || defaultAvatar}
											onError={e => e.target.setAttribute('src', defaultAvatar)}
										></img>
										<span
											onClick={() => onClickUserInModalOthers(item)}
											className='modal-tagged-others__name'
										>
											{item.users.fullName || item.users.firstName + ' ' + item.users.lastName}
										</span>
									</div>
								))}
							</>
						)}
					</Modal.Body>
				</Modal>
			</span>
		);
	}
}

WithFriends.propTypes = {
	data: PropTypes.any,
};
