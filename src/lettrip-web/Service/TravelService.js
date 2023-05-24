import { API_BASE_URL } from "../Constant/backendAPI";
import { formRequest, request } from "./APIService";

export function createTravelPlan(travel) {
  return request({
    url: API_BASE_URL + "/api/travel/plan/create",
    method: "POST",
    body: JSON.stringify(travel),
  });
}

export function createTravelReview(travel) {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(travel)], { type: "application/json" });
  formData.append("travel", blob);
  return formRequest({
    url: API_BASE_URL + "/api/travel/plan/create",
    method: "POST",
    data: formData,
  });
}

class TravelService {}
export default new TravelService();
