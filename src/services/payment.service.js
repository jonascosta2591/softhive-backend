import asaasApi from "../config/asaas.js";

export async function criarCobrancaPix(data) {
  const response = await asaasApi.post("/payments", {
    ...data,
    billingType: "PIX"
  });
  return response.data;
}

export async function getPixTransactionData(paymentId) {
  const response = await asaasApi.get(`/payments/${paymentId}/pixQrCode`);
  return response.data;
}

export async function consultarPagamento(paymentId) {
  const response = await asaasApi.get(`/payments/${paymentId}`);
  return response.data;
}