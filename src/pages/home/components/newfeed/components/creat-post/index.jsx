import { BookIcon, Hashtag, Feather, CategoryIcon } from 'components/svg';
import avatar from 'assets/images/avatar.png';

function CreatPost() {
	return (
		<div className='newfeed__creat-post'>
			<div className='newfeed__creat-post__avatar-and-input'>
				<div className='newfeed__creat-post__avatar'>
					<img data-testid='creat-post__user-avatar' src={avatar} alt='' />
				</div>
				<input className='newfeed__creat-post__input' placeholder='Tạo bài viết của bạn ...' />
			</div>
			<div className='newfeed__creat-post__options'>
				<div className='newfeed__creat-post__options__item'>
					<div className='newfeed__creat-post__options__item__logo'>
						<BookIcon className='newfeed__creat-post__options__item__logo--book' />
					</div>
					<span>Sách</span>
				</div>
				<div className='newfeed__creat-post__options__item'>
					<div className='newfeed__creat-post__options__item__logo'>
						<Feather />
					</div>
					<span>Tác giả</span>
				</div>
				<div className='newfeed__creat-post__options__item'>
					<div className='newfeed__creat-post__options__item__logo'>
						<CategoryIcon className='newfeed__creat-post__options__item__logo--category' />
					</div>
					<span>Chủ đề</span>
				</div>
				<div className='newfeed__creat-post__options__item'>
					<div className='newfeed__creat-post__options__item__logo'>
						<Hashtag className='newfeed__creat-post__options__item__logo--hashtag' />
					</div>
					<span>Hashtag</span>
				</div>
			</div>
		</div>
	);
}

export default CreatPost;
