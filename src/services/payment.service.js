import asaasApi from "../config/asaas.js";

export async function criarCobrancaPix(data) {
  const response = await asaasApi.post("/payments", {
    ...data,
    billingType: "PIX"
  });
  return response.data;
}