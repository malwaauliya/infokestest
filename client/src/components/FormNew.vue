<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
      <button @click="closeModal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
        ✕
      </button>
      <h2 class="text-2xl font-semibold mb-6 text-gray-700 text-center">
        {{ modalType === 'folder' ? 'Create New Folder' : 'Create New File' }}
      </h2>
      <FormKit
        type="form"
        :actions="false"
        :incomplete-message="false"
        ref="formKit"
        @submit="submitNewItem"
        class="space-y-4"
      >
        <FormKit
          type="text"
          name="name"
          label="Name"
          validation="required"
          placeholder="Enter name..."
          input-class="mt-1 p-3 border rounded-lg w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          validation-label-class="text-sm font-medium text-gray-700 mb-1"
          validation-message-class="text-red-500 text-sm flex items-center mt-1 bg-red-100 p-2 rounded"
        />
        <FormKit
          v-if="modalType === 'file'"
          type="text"
          name="format"
          label="Format"
          validation="required"
          placeholder="Enter file format (e.g., .txt, .jpg)..."
          input-class="mt-1 p-3 border rounded-lg w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          validation-label-class="text-sm font-medium text-gray-700 mb-1"
          validation-message-class="text-red-500 text-sm flex items-center mt-1 bg-red-100 p-2 rounded"
        />
        <p v-if="showMessage" class="text-sm text-red-500 mt-1 bg-red-100 p-2 rounded">{{ alertMessage }}</p>
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="closeModal" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
          <FormKit type="submit" input-class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Submit
          </FormKit>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    modalType: {
      type: String,
      required: true,
    },
    closeModal: {
      type: Function,
      required: true,
    },
    selectFolder: {
      type: Function,
      required: true,
    },
    currentFolder: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const showMessage = ref(false);
    const alertMessage = ref('');

    const submitNewItem = async (formData) => {
      try {
        showMessage.value = false;
        alertMessage.value = '';
        const { name, format } = formData;

        // Handle the API submission logic here
        const payload = props.modalType === 'folder' ? { name } : { name, format };
        if (props.currentFolder.id) {
          if (props.modalType === 'folder') {
            payload.id_parent = props.currentFolder.id
          } else {
            payload.id_folder = props.currentFolder.id
          }
        }
        await axios.post(`${import.meta.env.VITE_API_URL}/${props.modalType}s`, payload)
        .then(response => {
          props.closeModal(); // Close the modal after submission
          console.log()
          props.selectFolder(props.currentFolder); // Update folder view if needed
        })
        .catch(error => {
          console.error("Error fetching folders:", error);

          if (error.response) {
            showMessage.value = true;
            alertMessage.value = error.response.data.message;
          }
        });
      } catch (error) {
        console.error('Error creating new item:', error);
      }
    };


    return {
      showMessage,
      alertMessage,
      submitNewItem
    };
  }
});
</script>

<style scoped>
/* Add any specific styles for the modal here */
</style>
