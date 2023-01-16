import lockImage from 'assets/icons/lock.svg';
import './post-not-available.scss';

export default function PostNotAvailable() {
	return (
		<div className='post-not-available'>
			<img src={lockImage} alt='image' />
			<div className='post-not-available__text'>
				<div className='post-not-available__text-bold'>Nội dung này hiện không hiển thị</div>
				<div className='post-not-available__text-normal'>
					Lỗi này thường do chủ sở hữu chỉ chia sẻ nội dung với một nhóm nhỏ, thay đổi người được xem hoặc đã
					xóa nội dung.
				</div>
			</div>
		</div>
	);
}
