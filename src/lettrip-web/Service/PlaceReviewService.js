import { API_BASE_URL, ACCESS_TOKEN } from "../Constant/backendAPI";
import { formRequest, request } from "./APIService";

export function getPlace(xpoint, ypoint) {
  return request({
    url: API_BASE_URL + "/api/place" + `?xpoint=${xpoint}&ypoint=${ypoint}`,
    method: "GET",
  });
}

export function getReviewPage(placeId, pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/review" +
      `/${placeId}` +
      `?page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
}

export function createPlace(meetUpReviewForm) {
  return request({
    url: API_BASE_URL + "/api/place/create",
    method: "POST",
    body: JSON.stringify(meetUpReviewForm),
  });
} //장소 id 가져오기

export function showPlaceById(placeId) {
  return request({
    url: API_BASE_URL + "/api/place/" + placeId,
    method: "GET",
  });
} //장소 id 가져오기

class TravelService {}
export default new TravelService();
