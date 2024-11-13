<template>
  <div class="h-screen">
    <div class="bg-gray-100 p-3 flex items-center border-b shadow-md space-x-2 w-full">
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          New
        </button>
        <div v-if="dropdownVisible" class="absolute left-0 bg-white shadow-md rounded mt-1 z-10">
          <ul class="flex flex-col">
            <li @click="openModal('folder')" class="cursor-pointer px-4 py-2 hover:bg-gray-100 whitespace-nowrap">New Folder</li>
            <li v-if="currentFolder.id" @click="openModal('file')" class="cursor-pointer px-4 py-2 hover:bg-gray-100 whitespace-nowrap">New File</li>
          </ul>
        </div>
      </div>
      <div 
        v-if="currentFolder && currentFolder.id" 
        class="absolute left-0 right-3"      
        :style="{ 'margin-left': widthLeft + 'px' }"
      >
        <div class="bg-white px-2">
          <h2 class="whitespace-nowrap text-ellipsis overflow-hidden" :title="`${currentFolder.parentFolderName ? currentFolder.parentFolderName+'/' : ''}${currentFolder.name}`">{{currentFolder.parentFolderName ? currentFolder.parentFolderName+"/" : ''}}{{currentFolder.name}}</h2>
        </div>
      </div>
    </div>
    <div class="flex">
      <vue-draggable-resizable 
        :draggable="draggable" 
        :w="w"
        :h="h"
        :handles="handles" 
        :class-name-handle="classNameHandle"
        class="bg-gray-100 p-1 border-r relative h-full left-sidebar-custom shadow-md"
        :on-resize="onResize"
      >
        <div class="w-full overflow-hidden">
          <ul class="space-y-1 overflow-hidden flex-1">
            <li v-for="folder in folders" :key="folder.id" class="cursor-pointer">
              <!-- Recursive Folder Display -->
              <FolderItem :folder="folder" @select-folder="selectFolder" :currentFolder="currentFolder" />
            </li>
          </ul>
        </div>
      </vue-draggable-resizable>
      <main 
        class="flex-1 flex flex-col p-2 py-3"
        :style="{ 'margin-left': widthLeft + 'px' }"
      >
        <ul class="">
          <li
            v-for="folder in currentFolder.childs"
            :key="folder.id"
            class="p-1 hover:bg-gray-100 rounded cursor-pointer flex"
            @dblclick="selectFolder(folder)"
          >
            <div class="mr-2">
              <img src="/image/icon_fol.png" alt="Static Image" class="w-8"/>
            </div>
            <span class="text-sm py-1.5">{{ folder.name }}</span>
          </li>
          <li
            v-for="file in currentFolder.files"
            :key="file.id"
            class="p-1 hover:bg-gray-100 rounded cursor-pointer flex"
          >
            <div class="bg-blue-200 rounded-full h-8 w-8 flex items-center justify-center mb-2 items-center mr-2">
              <span class="text-blue-600 text-lg font-bold">{{ file.name.slice(0, 1).toUpperCase() }}</span>
            </div>
            <span class="text-sm py-1.5">{{ file.name+file.format }}</span>
          </li>
        </ul>
      </main>
    </div>
    <!-- Modal for New Folder/File -->
    <FormNew v-if="modalVisible" 
             :selectFolder="selectFolder"
             :currentFolder="currentFolder" 
             :modalType="modalType" 
             :closeModal="closeModal" />
  </div>
</template>

<script>
import axios from 'axios'
import { defineComponent } from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import FolderItem from './FolderItem.vue';
import FormNew from './FormNew.vue';
import "vue-draggable-resizable/style.css";

export default defineComponent({
  components: {
    VueDraggableResizable,
    FolderItem,
    FormNew,
  },
  data() {
    return {
      draggable: false,
      handles: ['mr'],
      classNameHandle: 'left-sidebar-handle',
      w: 300,
      h: 'auto',
      widthLeft: 300,
      folders: [],
      currentFolder: {},
      dropdownVisible: false,
      modalVisible: false,
      modalType: 'folder',
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    openModal(type) {
      this.modalType = type;
      this.modalVisible = true;
      this.dropdownVisible = false; // Close dropdown when opening modal
    },
    closeModal() {
      this.modalVisible = false;
    },
    setFolders(self, folderData, data, arrFolders=null, startIdx = 0) {
      let setChildsFolder;
      let setIdxSubFolder;
      let lastIdx;
      const splitIdxParent = typeof folderData.parentList === 'string' ? folderData.parentList.split(',') : [folderData.parentList];

      if (splitIdxParent.length > 1) {
        if (startIdx === splitIdxParent.length - 1) {
          setIdxSubFolder = arrFolders[splitIdxParent[startIdx]].childs.findIndex(o => o.id == folderData.id);
          setChildsFolder = data.map((c) => {
            c.parentList = folderData.parentList+","+setIdxSubFolder;
            c.parentFolderName = folderData.parentFolderName+"/"+arrFolders[splitIdxParent[startIdx]].childs[setIdxSubFolder].name;
            return c;
          })
          arrFolders[splitIdxParent[startIdx]].childs[setIdxSubFolder].childs = setChildsFolder;
        } else {
          const nextArrFolder = startIdx === 0 ? self.folders[splitIdxParent[startIdx]] : arrFolders[splitIdxParent[startIdx]];
          const nextStartIdx = startIdx + 1;
          self.setFolders(self, folderData, data, nextArrFolder.childs, nextStartIdx)
        }
        return {
          lastIdx: lastIdx
        };
      } else {
        setIdxSubFolder = self.folders[splitIdxParent[0]].childs.findIndex(o => o.id == folderData.id);
        setChildsFolder = data.map((c) => {
          c.parentList = folderData.parentList+","+setIdxSubFolder;
          c.parentFolderName = folderData.parentFolderName+"/"+self.folders[splitIdxParent[0]].childs[setIdxSubFolder].name;
          return c;
        })
        self.folders[splitIdxParent[0]].childs[setIdxSubFolder].childs = setChildsFolder;
        return {
          idx: splitIdxParent[0]
        };
      }
    },
    async getFolders(folderData, fromToggle=false) {
      try {
        let urlGet = `${import.meta.env.VITE_API_URL}/folders`;
        if (folderData) {
          urlGet += `?id_parent=${folderData.id}`;
        }
        let self = this;
        let findIdxFolder;
        let childsFolder;
        axios.get(urlGet)
        .then(function (response) {
          const data = response.data.data.rows;
          if (!folderData) {
            self.folders = data;
            self.currentFolder.childs = data; // Default to the first folder if available
          } else {
            findIdxFolder = self.folders.findIndex(o => o.id == folderData.id);
            if (findIdxFolder >= 0) {
              childsFolder = data.map((c) => {
                c.parentList = findIdxFolder;
                c.parentFolderName = self.folders[findIdxFolder].name;
                return c;
              })
              self.folders[findIdxFolder].childs = childsFolder;
            } else {
              const getSetFolder = self.setFolders(self, folderData, data);
              findIdxFolder = getSetFolder.idx;
            }
            if (!fromToggle) {
              folderData.childs = data;
              if (self.currentFolder.files) {
                folderData.files = self.currentFolder.files;
              }
              self.currentFolder = folderData;
            }
            console.log("self.currentFolder",self.currentFolder)
          }
        }).catch(function (error) {
          console.error("Error fetching folders:", error);
        });
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    },
    async getFiles(folderData) {
      try {
        let urlGetFiles = `${import.meta.env.VITE_API_URL}/files`;
        if (folderData) {
          urlGetFiles += `?id_folder=${folderData.id}`;
        }
        let self = this;
        axios.get(urlGetFiles)
        .then(function (response) {
          const data = response.data.data.rows;
          self.currentFolder.files = data;
        }).catch(function (error) {
          console.error("Error fetching files:", error);
        });
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    },
    async selectFolder(folder, fromToggle=false) {
      this.getFolders(folder, fromToggle);
      if (!fromToggle && folder) {
        this.getFiles(folder);
      }
    },
    onResize(handle, x, y, width, height) {
      this.widthLeft = width;
    },
  },
  mounted() {
    this.getFolders(); // Default to the first folder
  },
});
</script>

<style>
.left-sidebar-custom {
  border: 0px !important;
  height: 100% !important;
}

.left-sidebar-handle {
  position: absolute;
  border: 0px;
  border-radius: 0;
  height: 100%;
  width: 14px;
  box-model: border-box;
  -webkit-transition: all 300ms linear;
  -ms-transition: all 300ms linear;
  transition: all 300ms linear;
  display: block !important;
}

.left-sidebar-handle-mr {
  top: 0;
  margin-top: 0;
  right: 0px;
  cursor: e-resize;
}

.left-sidebar-handle-mr:before,
.left-sidebar-handle-mr:after {
  content: '';
  position: absolute;
  width: 2px;
  height: 14px;
  background-color: #000;
  top: Calc(50% - 14px);
  right: 4px;
}
.left-sidebar-handle-mr:before {
  right: auto;
  left: 4px;
}
</style>