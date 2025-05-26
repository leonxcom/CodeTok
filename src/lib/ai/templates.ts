export type TemplateId = 
  | 'nextjs-developer'
  | 'react-developer' 
  | 'vue-developer'
  | 'python-developer'
  | 'html-developer'
  | 'streamlit-developer'
  | 'code-interpreter-v1';

export interface Template {
  name: string;
  lib: string[];
  file: string;
  instructions: string;
  port?: number | null;
}

export type Templates = Record<TemplateId, Template>;

const templates: Templates = {
  'nextjs-developer': {
    name: 'Next.js developer',
    lib: ['react', 'next', 'typescript', 'tailwindcss'],
    file: 'app/page.tsx',
    instructions: 'A Next.js app that uses App Router.',
    port: 3000
  },
  'react-developer': {
    name: 'React developer',
    lib: ['react', 'typescript', 'tailwindcss'],
    file: 'App.tsx', 
    instructions: 'A React app that renders into a div with id "root".',
    port: 3000
  },
  'vue-developer': {
    name: 'Vue.js developer',
    lib: ['vue', 'typescript'],
    file: 'App.vue',
    instructions: 'A Vue.js app.',
    port: 3000
  },
  'python-developer': {
    name: 'Python developer',
    lib: ['python'],
    file: 'main.py',
    instructions: 'A Python script.',
    port: null
  },
  'html-developer': {
    name: 'HTML developer',
    lib: ['html', 'css', 'javascript'],
    file: 'index.html',
    instructions: 'An HTML page with CSS and JavaScript.',
    port: 3000
  },
  'streamlit-developer': {
    name: 'Streamlit developer',
    lib: ['streamlit', 'pandas', 'numpy', 'matplotlib'],
    file: 'app.py',
    instructions: 'A Streamlit app that reloads automatically.',
    port: 8501
  },
  'code-interpreter-v1': {
    name: 'Code Interpreter',
    lib: ['python'],
    file: 'main.py',
    instructions: 'A Python script that can be executed in a code interpreter.',
    port: null
  }
};

export default templates; 