<script setup>
import { ref, computed, onMounted } from 'vue';
import ModalCreateTarefa from './ModalCreateTarefa.vue';
import ModalEditarTarefa from './ModalEditarTarefa.vue';
import ModalConfirmarExcluir from './ModalConfirmarExcluir.vue';
import * as tarefaService from '../services/tarefaService';

const tarefas = ref([]);
const filtro = ref('');
const filtroStatus = ref('');

const modalCriar = ref({ visivel: false });
const modalEditar = ref({ visivel: false, tarefa: null });
const modalExcluir = ref({ visivel: false, tarefa: null });

const mensagemSucesso = ref('');
const mensagemExclusao = ref('');
const mensagemEdicao = ref('');

async function carregarTarefas() {
  tarefas.value = await tarefaService.getAllTarefas();
}

function abrirModalCriar() {
  modalCriar.value.visivel = true;
  mensagemSucesso.value = '';
}
function fecharModalCriar() {
  modalCriar.value.visivel = false;
  mensagemSucesso.value = '';
}

function abrirModalEditar(tarefa) {
  modalEditar.value.tarefa = { ...tarefa };
  modalEditar.value.visivel = true;
  mensagemEdicao.value = '';
}
function fecharModalEditar() {
  modalEditar.value.visivel = false;
  modalEditar.value.tarefa = null;
  mensagemEdicao.value = '';
}

function abrirModalExcluir(tarefa) {
  modalExcluir.value.tarefa = { ...tarefa };
  modalExcluir.value.visivel = true;
  mensagemExclusao.value = '';
}
function fecharModalExcluir() {
  modalExcluir.value.visivel = false;
  modalExcluir.value.tarefa = null;
  mensagemExclusao.value = '';
}

function isConcluida(status) {
  return status === 2 || status === 'Concluida' || status === 'Concluída';
}

function formatarDataHoraBrasilia(dataStr) {
  if (!dataStr) return '-';
  const dataUtc = new Date(dataStr);
  // Subtrai 3 horas do UTC para Brasília
  dataUtc.setHours(dataUtc.getHours() - 3);
  return dataUtc.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// CRUD
async function criarTarefa(novaTarefa) {
  await tarefaService.createTarefa(novaTarefa);
  await carregarTarefas();
  mensagemSucesso.value = 'Tarefa criada com sucesso!';
  setTimeout(() => {
    fecharModalCriar();
  }, 1200);
}

async function atualizarTarefa(tarefaAtualizada) {
  if (modalEditar.value.tarefa) {
    await tarefaService.updateTarefa(tarefaAtualizada.id, tarefaAtualizada);
    await carregarTarefas();
    fecharModalEditar();
    mensagemEdicao.value = 'Tarefa editada com sucesso!';
    setTimeout(() => {
      mensagemEdicao.value = '';
    }, 1200);
  }
}

async function confirmarExcluir() {
  if (modalExcluir.value.tarefa) {
    await tarefaService.deleteTarefa(modalExcluir.value.tarefa.id);
    await carregarTarefas();
    mensagemExclusao.value = 'Tarefa excluída com sucesso!';
    setTimeout(() => {
      fecharModalExcluir();
    }, 1200);
  }
}

// Filtros e helpers
const tarefasFiltradas = computed(() => {
  let lista = tarefas.value;
  if (filtroStatus.value !== '') {
    lista = lista.filter(t =>
      String(t.status) === filtroStatus.value ||
      (filtroStatus.value === '0' && (t.status === 'Pendente' || t.status === 'PENDENTE')) ||
      (filtroStatus.value === '1' && (t.status === 'EmProgresso' || t.status === 'Em Progresso')) ||
      (filtroStatus.value === '2' && (t.status === 'Concluida' || t.status === 'Concluída'))
    );
  }
  if (!filtro.value.trim()) return lista;
  return lista.filter(t =>
    t.titulo.toLowerCase().includes(filtro.value.toLowerCase()) ||
    (t.descricao && t.descricao.toLowerCase().includes(filtro.value.toLowerCase()))
  );
});


function formatarData(dataStr) {
  if (!dataStr) return '-';
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatarDataHora(dataStr) {
  if (!dataStr) return '-';
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

onMounted(carregarTarefas);
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Tarefas</h1>
      <div class="flex items-center space-x-2">
        <select v-model="filtroStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="">Todos</option>
          <option value="0">Pendente</option>
          <option value="1">Em Progresso</option>
          <option value="2">Concluída</option>
        </select>
        <input v-model="filtro" type="search" placeholder="Pesquisar tarefas..."
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <button @click="abrirModalCriar"
          class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 hover:shadow transition-all cursor-pointer ml-4">
          Criar Tarefa
        </button>
      </div>
    </div>

    <ul class="space-y-4">
      <li v-for="tarefa in tarefasFiltradas" :key="tarefa.id"
        class="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all flex justify-between items-start">
        <div class="flex flex-col max-w-[70%]">
          <h2 class="font-semibold text-lg text-gray-900">{{ tarefa.titulo }}</h2>
          <p v-if="tarefa.descricao" class="text-gray-600 mt-1">{{ tarefa.descricao }}</p>
          <div class="mt-2 text-sm text-gray-500">
            <span>Status: </span>
            <span :class="{
              'text-green-600 font-semibold': tarefa.status === 'Concluida',
              'text-red-600 font-semibold': tarefa.status === 'Pendente',
              'text-yellow-600 font-semibold': tarefa.status === 'EmProgresso'
            }">
              {{ tarefa.status }}
            </span>
            <span class="mx-2">|</span>
            <span>Criada em: {{ formatarDataHoraBrasilia(tarefa.dataCriacao) }}</span>
            <template v-if="isConcluida(tarefa.status) && tarefa.dataConclusao">
              <span class="mx-2">|</span>
              <span>Concluída em: {{ formatarDataHoraBrasilia(tarefa.dataConclusao) }}</span>
            </template>
          </div>
        </div>
        <div class="flex space-x-3">
          <button @click="abrirModalEditar(tarefa)"
            class="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer" title="Editar tarefa"
            aria-label="Editar tarefa">
            <!-- ícone lápis -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7 21H4v-3L16.732 4.732z" />
            </svg>
          </button>
          <button @click="abrirModalExcluir(tarefa)"
            class="text-red-600 hover:text-red-800 transition-colors cursor-pointer" title="Excluir tarefa"
            aria-label="Excluir tarefa">
            <!-- ícone lixeira -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
            </svg>
          </button>
        </div>
      </li>
    </ul>

    <transition name="fade">
      <div v-if="mensagemSucesso"
        class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50">
        {{ mensagemSucesso }}
      </div>
    </transition>

    <transition name="fade">
      <div v-if="mensagemEdicao"
        class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded shadow-lg z-50">
        {{ mensagemEdicao }}
      </div>
    </transition>

    <transition name="fade">
      <div v-if="mensagemExclusao"
        class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50">
        {{ mensagemExclusao }}
      </div>
    </transition>

    <ModalCreateTarefa :show="modalCriar.visivel" @close="fecharModalCriar" @create="criarTarefa" />

    <ModalEditarTarefa :show="modalEditar.visivel" :tarefa="modalEditar.tarefa" @close="fecharModalEditar"
      @update="atualizarTarefa" />

    <ModalConfirmarExcluir :show="modalExcluir.visivel" :tarefa="modalExcluir.tarefa" @close="fecharModalExcluir"
      @confirm="confirmarExcluir" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>