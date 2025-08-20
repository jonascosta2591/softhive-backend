import axios from "axios";

const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL
const API_PRIVATE_KEY = process.env.API_PRIVATE_KEY

const asaasApi = axios.create({
  baseURL: ASAAS_BASE_URL, // ou sandbox
  headers: {
    "Content-Type": "application/json",
    "access_token": API_PRIVATE_KEY
  }
});

export default asaasApi;
