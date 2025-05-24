import tarefaApi from '../api/TarefaApi';

export async function getAllTarefas() {
  const response = await tarefaApi.getAll();
  return response.data;
}

export async function getTarefaById(id) {
  const response = await tarefaApi.getById(id);
  return response.data;
}

export async function createTarefa(tarefa) {
  const response = await tarefaApi.create(tarefa);
  return response.data;
}

export async function updateTarefa(id, tarefa) {
  const response = await tarefaApi.update(id, tarefa);
  return response.data;
}

export async function deleteTarefa(id) {
  const response = await tarefaApi.delete(id);
  return response.data;
}