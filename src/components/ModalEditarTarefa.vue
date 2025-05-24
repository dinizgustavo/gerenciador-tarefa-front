<template>
    <div v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm transition-all">
        <div
            class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transition-transform duration-300 scale-100 relative">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Editar Tarefa</h3>
            <div v-if="mensagemErro" class="text-red-600 text-sm mb-2" aria-live="polite">{{ mensagemErro }}</div>
            <form @submit.prevent="submitEditar" class="space-y-4">
                <div>
                    <label for="titulo" class="block font-medium text-gray-700">Título *</label>
                    <input id="titulo" v-model="form.titulo" type="text" maxlength="100" required :disabled="loading"
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                    <label for="descricao" class="block font-medium text-gray-700">Descrição</label>
                    <textarea id="descricao" v-model="form.descricao" type="text" maxlenght="500" rows="3"
                        :disabled="loading"
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
                </div>
                <div>
                    <label for="status" class="block font-medium text-gray-700">Status *</label>
                    <select id="status" v-model.number="form.status" :disabled="loading"
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required>
                        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}
                        </option>
                    </select>
                </div>
                <div v-if="form.status === 2">
                    <label for="dataConclusao" class="block font-medium text-gray-700">Data de Conclusão *</label>
                    <input id="dataConclusao" type="datetime-local" v-model="form.dataConclusao"
                        :min="toLocalInputString(form.dataCriacao)" required
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <span v-if="erroDataConclusao" class="text-red-600 text-sm">A data de conclusão não pode ser menor
                        que a de criação.</span>
                </div>
                <div class="flex justify-end space-x-4 mt-6">
                    <button type="button" @click="cancelar" :disabled="loading"
                        class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="!podeSalvar" :class="[
                        'px-4 py-2 rounded transition cursor-pointer flex items-center justify-center',
                        !podeSalvar
                            ? 'bg-gray-300 text-gray-500 border border-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700'
                    ]">
                        <span v-if="!loading">Salvar</span>
                        <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue';

const props = defineProps({
    show: Boolean,
    tarefa: Object,
});
const emit = defineEmits(['close', 'update']);

const statusOptions = [
    { label: 'Pendente', value: 0 },
    { label: 'Em Progresso', value: 1 },
    { label: 'Concluída', value: 2 }
];

const form = reactive({
    id: '',
    titulo: '',
    descricao: '',
    status: 0,
    dataCriacao: '',
    dataConclusao: '',
});

const loading = ref(false);
const erroDataConclusao = ref(false);

watch(
    () => props.show,
    (novo) => {
        if (novo && props.tarefa) {
            form.id = props.tarefa.id;
            form.titulo = props.tarefa.titulo;
            form.descricao = props.tarefa.descricao || '';

            if (props.tarefa.status === 'Pendente' || props.tarefa.status === 0) form.status = 0;
            else if (props.tarefa.status === 'EmProgresso' || props.tarefa.status === 1 || props.tarefa.status === 'Em Progresso') form.status = 1;
            else if (props.tarefa.status === 'Concluida' || props.tarefa.status === 'Concluída' || props.tarefa.status === 2) form.status = 2;
            else form.status = 0;
            form.dataCriacao = props.tarefa.dataCriacao;

            if (props.tarefa.dataConclusao) {
                form.dataConclusao = toLocalInputString(props.tarefa.dataConclusao);
            } else if (form.status === 2) {
                form.dataConclusao = getLocalDateTimeString();
            } else {
                form.dataConclusao = '';
            }
            loading.value = false;
        }
    }
);

watch(
    () => form.status,
    (novo) => {
        if (novo === 2 && !form.dataConclusao) {
            form.dataConclusao = getLocalDateTimeString();
        }
        if (novo !== 2) {
            form.dataConclusao = null;
        }
    }
);

watch(
    () => form.dataConclusao,
    (novaData) => {
        if (form.status !== 2) {
            erroDataConclusao.value = false;
            return;
        }
        if (!novaData || !form.dataCriacao) {
            erroDataConclusao.value = false;
            return;
        }
        const dataCriacaoUtc = new Date(form.dataCriacao);
        dataCriacaoUtc.setHours(dataCriacaoUtc.getHours() - 3);

        const dataConclusaoLocal = new Date(novaData);

        erroDataConclusao.value = dataConclusaoLocal.getTime() < dataCriacaoUtc.getTime();
    }
);

function toLocalInputString(utcStr) {
    const date = new Date(utcStr);

    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const pad = n => n.toString().padStart(2, '0');
    return `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}`;
}

function toUtcString(localStr) {
    return new Date(localStr).toISOString();
}

function getLocalDateTimeString(date = new Date()) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const podeSalvar = computed(() =>
    !loading.value &&
    form.titulo.trim().length > 0 &&
    form.titulo.trim().length <= 100 &&
    form.descricao.length <= 500 &&
    (
        form.status !== 2
        || (
            form.dataConclusao && !erroDataConclusao.value
        )
    )
);

const mensagemErro = ref('');

async function submitEditar() {
    if (loading.value) return;
    loading.value = true;
    mensagemErro.value = '';
    try {
        if (form.status === 2 && (!form.dataConclusao || erroDataConclusao.value)) {
            mensagemErro.value = 'A data de conclusão é obrigatória e não pode ser menor que a de criação.';
            loading.value = false;
            return;
        }
        emit('update', {
            id: form.id,
            titulo: form.titulo,
            descricao: form.descricao,
            status: form.status,
            dataCriacao: form.dataCriacao,
            dataConclusao: form.status === 2 && form.dataConclusao
                ? toUtcString(form.dataConclusao)
                : null,
        });
        emit('close');
    } catch (error) {
        mensagemErro.value = 'Erro ao salvar tarefa. Tente novamente.';
    } finally {
        loading.value = false;
    }
}

function cancelar() {
    if (!loading.value) {
        emit('close');
    }
}


</script>