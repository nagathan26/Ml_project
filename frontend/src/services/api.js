import axios from "axios"

export const api = {
  predict: (data) => axios.post("/api/predict/", data).then(r => r.data),
  metrics: ()     => axios.get("/api/metrics/").then(r => r.data),
  health:  ()     => axios.get("/api/health/").then(r => r.data),
}