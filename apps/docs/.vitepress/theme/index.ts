import DefaultTheme from 'vitepress/theme';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@auronui/styles/index.css';
import './style.css';
import PropsTable from '../components/PropsTable.vue';
import SlotsTable from '../components/SlotsTable.vue';
import EventsTable from '../components/EventsTable.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    app.component('PropsTable', PropsTable);
    app.component('SlotsTable', SlotsTable);
    app.component('EventsTable', EventsTable);
  },
};
