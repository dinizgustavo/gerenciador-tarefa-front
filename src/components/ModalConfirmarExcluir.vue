<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm transition-all">
        <div class="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Confirmar exclusão</h3>
            <p class="mb-6 text-gray-700">
                Tem certeza que deseja excluir a tarefa
                <strong>{{ tarefa?.titulo }}</strong>?
            </p>

            <div class="flex justify-end space-x-4">
                <button @click="$emit('close')"
                    class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer">
                    Cancelar
                </button>
                <button @click="$emit('confirm')"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer">
                    Excluir
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    show: Boolean,
    tarefa: Object,
});

const emit = defineEmits(['close', 'confirm']);

const loading = ref(false);
const mensagemSucesso = ref('');

watch(() => props.show, (newVal) => {
    if (newVal) {
        loading.value = false;
        mensagemSucesso.value = '';
    }
});

function handleConfirm() {
    loading.value = true;
    emit('confirm');
}

function onDeleteSuccess() {
    loading.value = false;
    mensagemSucesso.value = 'Tarefa excluída com sucesso!';
    setTimeout(() => {
        mensagemSucesso.value = '';
        emit('close');
    }, 1500);
}

defineExpose({
    onDeleteSuccess,
});

</script>
