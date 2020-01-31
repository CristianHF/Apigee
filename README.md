# Apigee

Registrarse en Apigee: [Apigee login](https://login.apigee.com/login "Apigee login")

-----

### Importar spec

En el menú Develop -> Specs, pulsando en el botón **+Spec**, hay 3 opciones:

* New Spec: pegar el swagger directamente en el editor
* Import URL...: usando una URL, por ejemplo de GitHub
* Import file...: cargar un fichero local

-----

### Crear proxy a partir de una spec

En el menú Develop -> Specs, pasando el ratón por encima, aparecen varias opciones a la derecha, seleccionar la primera llamada "Generate proxy" y se lanza el wizard.

* Proxy details: se autorrellenan todos los campos a partir de los valores extraidos de la spec, pero los vamos a cambiar por los siguientes

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name: Products

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Base path: /

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Description: Products API

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Target: dejar la que hay (http://cloud.hipster.s.apigee.com/)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pulsar **Next**

* Policies: aquí no tocamos nada, pulsamos **Next**

* Flows: aqui se seleccionan los recursos que queremos desplegar, lo dejamos tal cual y pulsamos **Next**

* Virtual hosts: dejamos como está y pulsamos **Next**

* Summary: opcionalmente podemos elegir si al crear el API proxy, lo desplemamos automáticamente, seleccionamos la opción **test** y terminamos pulsando en **Create**

-----

### Primera prueba

Con esto ya podemos empezar a consumir la API. Nos vamos al menú Develop -> API Proxies y seleccionamos el proxy anteriormente creado.

En esta primera pantalla se nos muestra un resumen del proxy y entre otras cosas la URL de llamada.

*Para empezar a añadirle un poco de seguridad, es necesario asociar el API Proxy a un producto, ese producto debe ser consumido por una Developer APP y esa APP debe tener asociado un Developer*

-----

### Crear un API Product

En el menú Publish -> API Products, pulsar el botón **+API Product** de arriba a la derecha

**En la sección de Products Details**
* Name: nombre interno que tendrá el producto
* Display Name: o título del producto, nombre con el que se visualizará en el listado de productos
* Environment: seleccionar el check **test**
* Access: seleccionar **Private** del menú desplegable

**En la sección de API resources**

* Añadir un proxy en la sección **API proxies** pulsando en **Add a proxy**. En la ventana que aparece seleccionar el proxy **Products** creado anteriormente

Pulsar el botón **Save** de arriba a la derecha.

-----

### Dar de alta a un Developer

En el menú Publish -> Developer, pulsar en el botón **+Developer** de arriba a la derecha e introducir los datos necesarios.

-----

### Crear una Developer APP

En el menú Publish -> Apps, pulsar en el botón **+App** de arriba a la derecha y rellenar los campos.

**En la sección de App Details**
* Name: nombre interno que tendrá la developer app
* Display Name: o título de la app
* En el radio button seleccionar **Developer** y en el cuadro de búsqueda seleccionar la app recién creada

**En la sección de Credentials**
* Product: pulsar el botón **Add product** y seleccionar el producto creado anteriormente.

Pulsar el botón **Create** de arriba a la derecha.

-----

### Validación del API Key

En el menú Develop -> API Proxies, seleccionar el proxy Products y movernos a la pestaña **DEVELOP**
* En el menú de la izquierda, en **Policies** podemos añadir políticas al proxy pulsando el botón **+**
* Ir a la sección **SECURITY** y seleccionar la política **Verify API Key**
* Rellenar el campo **Display Name** y pulsar el botón **Add**
* En el editor xml que se nos abre podemos cambiar la ubicación y el nombre de la API Key en la petición, por defecto está puesta como *queryparam* y como nombre *apikey*. Vamos a cambiarla a *header_ y como nombre *X-Client-Id_
