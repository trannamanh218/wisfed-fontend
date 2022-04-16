import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { CloseIconX } from 'components/svg';

const PopupQuestion = ({ handleClose }) => {
	const textArea = useRef(null);
	return (
		<div className='popup-question__container'>
			<div className='popup-question__title'>
				<h3>Trả lời câu hỏi</h3>
				<button>
					<CloseIconX onClick={handleClose} />
				</button>
			</div>
			<div className='popup-question__name-group'>
				<img
					src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
					alt=''
				/>
				<div className='popup-question__name-group-text'>
					<div>Đọc sách cùng Shadow</div>
					<div style={{ color: '#6E7191 ' }}>Nhóm công khai</div>
				</div>
			</div>
			<div className='popup-question__discription'>
				<span>
					Yêu cầu tham gia của bạn đang được chờ duyệt Hãy trả lời các câu hỏi sau của quản trị viên nhóm để
					họ có thể xem xét yêu cầu tham gia của bạn. Câu hỏi của bạn sẽ chỉ hiển thị với quản trị viên và
					người kiểm duyệt
				</span>
			</div>
			<div className='popup-question__select'>
				<span>Bạn đã đọc DragonBall chưa</span>
				<div>
					<input type='radio' /> <span>Chưa đọc</span>
				</div>
				<div>
					<input type='radio' /> <span>Đã từng</span>
				</div>
			</div>
			<div className='popup-question__answer'>
				<h4>Bạn biết Songoku là ai không</h4>
				<textarea placeholder='Viết câu trả lời' ref={textArea} className='form-field-textarea' rows={5} />
			</div>
			<div className='popup-question__btn'>
				<button>Gửi</button>
			</div>
		</div>
	);
};

PopupQuestion.propTypes = {
	handleClose: PropTypes.func,
};

export default PopupQuestion;
