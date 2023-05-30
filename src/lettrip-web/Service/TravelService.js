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

class TravelService {}
export default new TravelService();
