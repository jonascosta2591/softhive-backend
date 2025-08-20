import asaasApi from "../config/asaas.js";

export async function criarCliente(data) {
  const response = await asaasApi.post("/customers", data);
  return response.data;
}

export async function listarClientes() {
  const response = await asaasApi.get("/customers");
  return response.data;
}