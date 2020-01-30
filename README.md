# Apigee

Registrarse en Apigee: [Apigee login](https://login.apigee.com/login "Apigee login")


### Importar spec

En el menú Develop -> Specs, pulsando en el botón +Spec, hay 3 opciones:

* New Spec: pegar el swagger directamente en el editor
* Import URL...: usando una URL, por ejemplo de GitHub
* Import file...: cargar un fichero local


### Crear proxy a partir de una spec

En el menú Develop -> Specs, pasando el ratón por encima, aparecen varias opciones a la derecha, seleccionar la primera llamada "Generate proxy" y empieza la configuración paso por paso.

* Proxy details: se autorrellenan todos los campos a partir de los valores extraidos de la spec, pero los vamos a cambiar por los siguientes
···Name: Products-API
···Base path: /
···Description: Products API
···Target: dejar la que hay (http://cloud.hipster.s.apigee.com/)
···Pulsar **Next**
