import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN } from "../Constant/backendAPI";
import { formRequest, request } from "./APIService";

export function createTravelPlan(planForm) {
  return request({
    url: API_BASE_URL + "/api/travel/plan/create",
    method: "POST",
    body: JSON.stringify(planForm),
  });
}

export function createTravelReview({ reviewForm, imageFiles }) {
  console.log(imageFiles);
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append("files", file);
  });
  const reviewFormJson = new Blob([JSON.stringify(reviewForm)], {
    type: "application/json",
  });
  formData.append("travel", reviewFormJson);

  return formRequest({
    url: API_BASE_URL + "/api/travel/review/create",
    method: "POST",
    data: formData,
  });
}

export function createTravelReviewAxios({ reviewForm, imageFiles }) {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append("files", file);
  });
  const reviewFormJson = new Blob([JSON.stringify(reviewForm)], {
    type: "application/json",
  });
  formData.append("travel", reviewFormJson);
  return axios.post(`${API_BASE_URL}/api/travel/review/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
    },
  });
}

export function searchTravelList(searchForm, pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/travel" +
      `?province=${searchForm.province}&city=${searchForm.city}&minCost=${searchForm.minCost}&maxCost=${searchForm.maxCost}
    &minNumberOfCourses=${searchForm.minNumberOfCourses}&maxNumberOfCourses=${searchForm.maxNumberOfCourses}
    &travelTheme=${searchForm.travelTheme}` +
      `&page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
}

export function getTravelDetail(id) {
  return request({
    url: API_BASE_URL + `/api/travel/${id}`,
    method: "GET",
  });
}

class TravelService {}
export default new TravelService();
