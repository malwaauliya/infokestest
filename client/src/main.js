import { createApp } from 'vue'
import { plugin, defaultConfig } from '@formkit/vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import './index.css'
import config from './formkit.config.js'
import App from './App.vue'
//default styles
import "vue-draggable-resizable/style.css";

createApp(App)
    .use(plugin, defaultConfig(config))
    .component("vue-draggable-resizable", VueDraggableResizable)
    .mount('#app')
