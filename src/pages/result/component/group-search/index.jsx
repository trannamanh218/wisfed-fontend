import './group-search.scss';
import Button from 'shared/button';
import DefaultImageGroup from 'assets/images/DefaultImageGroup.png';

const GroupSearch = () => {
	return (
		<div className='group__search__container'>
			<div className='group__search__main'>
				<div className='group__search__left'>
					<img src={DefaultImageGroup} className='group__search__img' />
					<div className='group__search__content'>
						<div className='group__search__title'>Nhóm tác giả Mai Nguyễn</div>
						<div className='group__search__info'>Nhóm công khai. 32k thành viên 2 bài viết/tháng</div>
					</div>
				</div>

				<Button>
					<span className='group__search__button'>Tham gia nhóm</span>
				</Button>
			</div>
		</div>
	);
};
export default GroupSearch;
