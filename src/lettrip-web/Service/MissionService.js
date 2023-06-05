import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function saveMission(missionForm) {
  return request({
    url: API_BASE_URL + "/api/mission/create",
    method: "POST",
    body: JSON.stringify(missionForm),
  });
}

export function getRanking(rankingForm) {
  return request({
    url: API_BASE_URL + "/api/mission/ranking",
    method: "POST",
    body: JSON.stringify(rankingForm),
  });
}
