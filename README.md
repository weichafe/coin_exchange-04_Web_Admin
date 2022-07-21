#### Install Prerequisites
The following dependencies are required to run an instance:

1. NodeJS - 9.11.2
2. Npm - 5.6.0

1. npm install
2. npm run dev
3. npm run build

sudo yum install gcc gcc-c++
npm install -g node-gyp


#### Contribuir

1. Bifurcar este proyecto
2. Hazaña_xxx
3. Ingrese el código
4. Solicitud de extracción

#### 
     -build
        -config.js
        -env.js
        -webpack.base.config.js
        -webpack.dev.config.js
        -webpack.prod.config.js
    -src 主目录
        -caculate
            caculate.js
        -config
            -- api.js
            -- storage.js
        -images
        -libs
        -locale Archivos de configuración multilingües, aún no admitidos
        -router Configuración de enrutamiento front-end
        -service Encapsula las solicitudes de interfaz de axios y el procesamiento de interfaz de solicitudes de página
        -smeditor editor de texto enriquecido
        -store Vuex store
        -styles estilo común
        -template 线上index.html模版 ejs
        -vendors importación js requerida por el entorno de desarrollo
        -views directorio de paginas
        app.vue inicialización de página
        main.js archivo de entrada

    -index.html
    -package.json
