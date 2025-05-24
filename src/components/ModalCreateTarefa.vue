<template>
    <div v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm transition-all">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transition-transform duration-300 scale-100">
            <h2 class="text-xl font-semibold mb-4">Criar Nova Tarefa</h2>
            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label class="block font-medium mb-1">Título *</label>
                    <input v-model="tarefa.titulo" maxlength="100" required
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Digite o título da tarefa" />
                </div>
                <div>
                    <label class="block font-medium mb-1">Descrição</label>
                    <textarea v-model="tarefa.descricao"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        rows="3" placeholder="Descrição (opcional)"></textarea>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="close"
                        class="px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit"
                        class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all">
                        Criar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    show: Boolean,
});
const emit = defineEmits(['close', 'create']);

const tarefa = ref({
    titulo: '',
    descricao: '',
});

function submitForm() {
    emit('create', tarefa.value);
    tarefa.value = { titulo: '', descricao: '' };
    emit('close');
}

function close() {
    emit('close');
}

</script>
