<template>
  <div>
    <div :class="`flex items-center ${ currentFolder && currentFolder.id === folder.id ? '' : 'hover:bg-gray-200'} rounded cursor-pointer w-full ${ currentFolder && currentFolder.id === folder.id ? 'bg-gray-300' : ''}`">
      <span  @click="toggleOpen" class="pl-2 py-1 text-center" :style="{ 'width': '20px' }">
        {{ folder.childs && folder.childs.length < 1 ? ' ' : isOpen ? '-' : '+' }}
      </span>
      <span @click="selectFolder" @dblclick="toggleOpen" class="px-2 py-1 w-full whitespace-nowrap">{{ folder.name }}</span>
    </div>
    <!-- Recursive rendering of subfolders -->
    <ul v-if="isOpen && folder.childs && folder.childs.length" class="ml-0.5">
      <li v-for="folderChilds in folder.childs" :key="folderChilds.id">
        <FolderItem :folder="folderChilds" @select-folder="$emit('select-folder', $event)" :currentFolder="currentFolder" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FolderItem',
  props: {
    folder: {
      type: Object,
      required: true,
    },
    currentFolder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false, // Tracks if folder is open or closed
    };
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$emit('select-folder', this.folder, 'true');
      }
    },
    selectFolder() {
      this.$emit('select-folder', this.folder);
    },
  },
};
</script>

<style scoped>
/* Style adjustments for nested folders */
ul {
  list-style-type: none;
  padding-left: 1rem;
}
</style>
