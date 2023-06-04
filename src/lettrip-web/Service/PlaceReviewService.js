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
