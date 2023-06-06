import basic_image from "../../../image/basic_image.png";
import "./PlaceReview.css";

const ReviewItem = ({ review }) => {
  return (
    <div className='review_item'>
      <div className='review_item_element'>
        <div>
          <div className='review_writerNickname'>
            작성자 : {review.writerNickname}
          </div>
        </div>
        <div>
          <div className='review_text'>{review.visitTimes}번째 방문</div>
        </div>
      </div>
      <div className='review_item_element'>
        {review.fileUrls.length === 0 ? (
          <img className='review_img' src={basic_image} />
        ) : (
          <img className='review_img' src={review.fileUrls[0]} />
        )}
        <div className='review_info_item'>
          <div className='review_rating'>{review.rating}점</div>
          <div className='review_detailReview_container'>
            <div className='review_detailReview'>
              {review.detailReview.substring(0, 55)}
              {review.detailReview.length > 55 ? (
                <span className='detailReview_cut'> ...중략</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
