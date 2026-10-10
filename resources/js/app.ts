import { createInertiaApp } from '@inertiajs/vue3';
import 'reset-css/reset.css';
import { createPinia } from 'pinia';
import { createApp, h } from "vue";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const pinia = createPinia();

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    withApp: (app) => {
        app.use(pinia);

        app.directive('focus', {
            mounted: (el: HTMLElement, shouldFocus) => {
                if (shouldFocus.value !== false) {
                    el.focus();
                }
            },
        });
    },
    // setup({ el, App, props, plugin }) {
    //     const app = createApp({ render: () => h(App, props) });
    //     app.use(plugin);
    //     app.use(pinia);
    //     app.mount(el);
    // },
    progress: {
        color: '#4B5563',
    },
});
