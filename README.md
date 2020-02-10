# Apigee

Registrarse en Apigee: [Apigee](https://login.apigee.com/login "Apigee")

-----

### Importar spec

En el menú Develop -> Specs, pulsando en el botón **+Spec**, hay 3 opciones:

* New Spec: pegar el swagger directamente en el editor
* Import URL...: usando una URL, por ejemplo de GitHub
* Import file...: cargar un fichero local

-----

### Crear proxy a partir de una spec:

Importar la spec **Products**

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

Pulsar el botón **Create** de arriba a la derecha. Una vez creada, podemos copiarnos el key y el secret para usarlo más tarde.

-----

### Validación del API Key

En el menú Develop -> API Proxies, seleccionar el proxy Products y movernos a la pestaña **DEVELOP**
* En el menú de la izquierda, en **Policies** podemos añadir políticas al proxy pulsando el botón **+**
* Ir a la sección **SECURITY** y seleccionar la política **Verify API Key**
* Rellenar el campo **Display Name** y pulsar el botón **Add**
* En el editor xml que se nos abre podemos cambiar la ubicación y el nombre de la API Key en la petición, por defecto está puesta como **queryparam** y como nombre **apikey**. Vamos a cambiarla a **header** y como nombre **X-Client-Id**
* Una vez configurada, hay que añadirla al flujo de ejecución del proxy. En el menú de la izquierda, en la sección de **Proxy Endpoints**, seleccionamos el **PreFlow** y arrastramos la política creada al editor gráfico.
* Pulsamos el boton **Save** de arriba a la izquierda
* Para probar, debemos incluir en Postman la cabecera **X-Client-Id** con valor el API Key que copiamos de la Developer APP

[Documentación online Apigee sobre validación del API Key](https://docs.apigee.com/api-platform/reference/policies/verify-api-key-policy)

-----

### Quotas

Sirven para limitar el número de llamadas a una API, para ello necesitamos un API Product y una Developer APP específicos.

**Crear un nuevo API Product**
* Al llegar a la parte de **Quota**, configurarlo a 5 peticiones por minuto
* Asociarle el API Proxy creado

**Crear una nueva APP**
* Asociarle el producto recién creado

**Modificar la configuración del API Proxy**

En el menú Develop -> API Proxies, seleccionar el proxy Products y movernos a la pestaña **DEVELOP**
* En el menú de la izquierda, en **Policies** podemos añadir políticas al proxy pulsando el botón **+**
* Ir a la sección **TRAFFIC MANAGEMENT** y seleccionar la política **Quota**
* Rellenar el campo **Display Name** y pulsar el botón **Add**
* En la sección del **PreFlow**, arrastrar la nueva política hasta colocarla al lado de la política de verificación del API Key
* Modificar el xml con los siguientes valores:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Quota async="false" continueOnError="false" enabled="true" name="Quota" type="calendar">
    <DisplayName>Quota</DisplayName>
    <Allow count="3" countRef="verifyapikey.Verify-API-Key.apiproduct.developer.quota.limit"/>
    <Interval ref="verifyapikey.Verify-API-Key.apiproduct.developer.quota.interval">1</Interval>
    <TimeUnit ref="verifyapikey.Verify-API-Key.apiproduct.developer.quota.timeunit">minute</TimeUnit>
    <Identifier ref="verifyapikey.Verify-API-Key.client_id"/>
    <Distributed>true</Distributed>
    <Synchronous>true</Synchronous>
    <StartTime>2019-01-01 12:00:00</StartTime>
</Quota>
```

**Allow**: indica el límite de llamadas por unidad de tiempo, se obtiene del producto y si no tiene ninguno asignado, se coge el indicado por **count**

**Interval**: indica el número de unidades de tiempo empleado en el cálculo de la cuota de uso, se obtiene del producto y si no tiene ninguno asignado, se coge el indicado en la etiqueta

**TimeUnit**: indica la unidad de tiempo empleada en el cálculo de la cuota de uso, se obtiene del producto y si no tiene ninguna asignado, se coge el indicado en la etiqueta

* Pulsar el botón **Save** de arriba a la izquierda

* Para hacer la prueba, usamos el nuevo client id y llamamos 5 veces a la API, todas OK, a la 6ª llamada, devolverá un error **429 Too Many Requests**

[Documentación online Apigee sobre Quotas](https://docs.apigee.com/api-platform/reference/policies/quota-policy)

-----

### Parametrización con Key Value Maps (KVM)

En el menú Admin -> Environments -> Key Value Maps, cambiar al entorno **test** y pulsar el botón de arriba a la derecha **+Key value map**

* Ponerle como nombre por ejemplo **products_kvm**, luego pulsar en el botón **Add**
* Añadir una pareja de clave valor pulsando el botón de arriba a la derecha **Add key value pair**
* Ponerle un nombre, por ejemplo **target-url** y valor **http://cloud.hipster.s.apigee.com/**
* Pulsar el botón **Add**

Una vez creado el KVM, volvemos al API Proxy y creamos una nueva política, de tipo **Key Value Map Operations** y la añadimos **REQUEST** del **PreFlow**. Sustituir el contenido por el siguiente:
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<KeyValueMapOperations async="false" continueOnError="false" enabled="true" name="Key-Value-Map" mapIdentifier="products_kvm ">
    <DisplayName>Key Value Map</DisplayName>
    <Properties/>
    <Get assignTo="targetUrl">
        <Key>
            <Parameter>target-url</Parameter>
        </Key>
    </Get>
    <Scope>environment</Scope>
</KeyValueMapOperations>
```
*Teniendo especial cuidado en el campo **mapIdentifier**, que debe hacer referencia al KVM creado y al **Parameter**, que debe coincidir con la clave cuyo valor quremos recuperar. Esto guarda en una variable llamada **targetUrl** la URL guardada en el KVM.*

Ahora creamos una nueva política de tipo **Assign Message** y editamos el xml
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<AssignMessage async="false" continueOnError="false" enabled="true" name="Set-Target-Url">
    <DisplayName>Set Target Url</DisplayName>
    <Properties/>
    <AssignVariable>
        <Name>target.url</Name>
        <Value>targetUrl</Value>
        <Ref>targetUrl</Ref>
    </AssignVariable>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
    <AssignTo createNew="false" transport="http" type="request"/>
</AssignMessage>
```
*La variable **target.url** es una variable de entorno de Apigee que contiene la URL a la que se llama, aquí la estamos modificando.*

En el menú e la izquierda, añadir un nuevo recurso en la sección **Resources**. Creamos un nuevo fichero, de tipo javascript y nombre **set-target-url**, pulsamos el botón **Add**. Deberá contener esto:
```js
context.setVariable("target.url", context.getVariable("target.url") + context.getVariable("proxy.pathsuffix"));
```
*Aquí únicamente le estamos concatenando el endpoint a la target url*.

Creamos una nueva política, de tipo **Javascript**, basada en el recurso recién creado, llamada **Set Target Url JS**.

Nos movemos al Target Endpoint **default** y añadimos a la **REQUEST** del **PreFlow** las políticas **Assign Message** y **Set Target Url JS**.

Para evitar confusiones, podemos cambiar el valor **URL** de la sección **HTTPTargetConnection** y al hacer la prueba comprobaremos que no la tendrá en cuenta, siempre usará la URL del KVM.

[Documentación online Apigee sobre Key Value Map Operations](https://docs.apigee.com/api-platform/reference/policies/key-value-map-operations-policy)

[Documentación online Apigee sobre Assign Message](https://docs.apigee.com/api-platform/reference/policies/assign-message-policy)

-----

### Securizar API Proxy con OAuth

Importar la spec **Accounts** y crear un proxy básico, con **Base path: /** y **Target** cualquier cosa, ya que no lo vamos a usar.

Entramos a la sección **DEVELOP** del API Proxy y en el menú de la izquierda eliminar el Target Endpoint **default**

Añadimos un nuevo recurso en la sección **Resources**
* Creamos nuevo fichero, de tipo javascript y nombre **accounts_list.js**, pulsamos el botón **Add**
* En el editor copiar el contenido del fichero accounts-list.js
* Repetir el proceso para **account-details.js**

Creamos 2 nuevas políticas, de tipo **JavaScript**, basadas en los recursos que acabamos de crear.
Añadimos cada política al flujo **RESPONSE** correspondiente de cada endpoint/recurso.

Creamos una nueva política de tipo **Extract Variables**, llamada **Extract Account Id** y en el editor xml introducimos la siguiente configuración:
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ExtractVariables async="false" continueOnError="false" enabled="true" name="Extract-Account-Id">
    <DisplayName>Extract Account Id</DisplayName>
    <Properties/>
    <URIPath name="accountId">
        <Pattern>**/{accountId}</Pattern>
    </URIPath>
    <Source clearPayload="false">request</Source>
    <VariablePrefix>requestpath</VariablePrefix>
</ExtractVariables>
```
Luego la añadimos al flujo **RESPONSE** del detalle de cuenta, justo antes de la política **Account Details**.

*Con esto creamos una variable de entorno que luego la política **Account Details** usará*

Además, creamos y añadimos la política de verificación del API Key al PreFlow.

Creamos 2 nuevas políticas de tipo **OAuth v2.0**, una para el listado de cuentas y otra para el detalle de cuentas.
* A cada una de ellas le añadiremos la etiqueta **Scope** en el editor xml, indicando el scope correspondiente
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OAuthV2 async="false" continueOnError="false" enabled="true" name="OAuth-v20-Accounts-List">
    <DisplayName>OAuth v2.0 Accounts List</DisplayName>
    <Properties/>
    <Attributes/>
    <ExternalAuthorization>false</ExternalAuthorization>
    <Operation>VerifyAccessToken</Operation>
    <SupportedGrantTypes/>
    <GenerateResponse enabled="true"/>
    <Tokens/>
    <Scope>accounts_list.read</Scope>
</OAuthV2>
```
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OAuthV2 async="false" continueOnError="false" enabled="true" name="OAuth-v20-Account-Details">
    <DisplayName>OAuth v2.0 Account Details</DisplayName>
    <Properties/>
    <Attributes/>
    <ExternalAuthorization>false</ExternalAuthorization>
    <Operation>VerifyAccessToken</Operation>
    <SupportedGrantTypes/>
    <GenerateResponse enabled="true"/>
    <Tokens/>
    <Scope>account_details.read</Scope>
</OAuthV2>
```
* Luego añadimos las políticas al flujo **REQUEST** de cada endpoint

**Crear además un API Product y una Developer APP.** En el caso del API Proudct, al crearlo, hay que configurarle unos scopes en la sección de **Allowed OAuth scope**, separados únicamente por comas sin espacios en blanco.

Si no se dispone de un API Proxy OAuth por defecto, hay que cargarlo
* En el menú Develop -> API Proxies, pulsar el botón **+API Proxy** de arriba a la derecha
* Seleccionar la opción **Upload proxy bundle**
* Cargar el zip de oauth, podemos cambiarle el nombre si queremos
* Pulsar **Next**
* Opcionalmente podemos desplegar el proxy a la vez que lo creamos, en este caso vamos a configurarlo antes de desplegarlo
* Pulsamos **Create**
* Editamos el proxy en la pestaña **DEVELOP**
* Modificamos la política **GenerateAccessTokenClient** indicando que el **grant_type** lo vamos a extraer como form parameter y no como query parameter
* Además le añadimos un campo más de entrada, el scope para el que queremos generar el access token

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OAuthV2 name="GenerateAccessTokenClient">
    <!-- This policy generates an OAuth 2.0 access token using the client_credentials grant type -->
    <Operation>GenerateAccessToken</Operation>
    <!-- This is in millseconds, so expire in an hour -->
    <ExpiresIn>3600000</ExpiresIn>
    <SupportedGrantTypes>
        <!-- This part is very important: most real OAuth 2.0 apps will want to use other
         grant types. In this case it is important to NOT include the "client_credentials"
         type because it allows a client to get access to a token with no user authentication -->
        <GrantType>client_credentials</GrantType>
    </SupportedGrantTypes>
    <GrantType>request.formparam.grant_type</GrantType>
    <Scope>request.formparam.scope</Scope>
    <GenerateResponse/>
</OAuthV2>
```

[Documentación online Apigee sobre como securizar APIs](https://docs.apigee.com/api-platform/tutorials/secure-calls-your-api-through-oauth-20-client-credentials)

-----

### Prueba completa con seguridad

* El primer paso es llamar al API Proxy OAuth, indicando como form parameter el **grant_type** y el **scope**, separados por espacios en blanco si fuesen varios. Además hay que informar las credenciales y se puede hacer de dos formas, informando los campos **client_id** y **client_secret** como form parameters o como cabecera **Authorization** de tipo **Basic**. Esto nos devuelve un JSON con un access token entre otros campos
* Con ese access token podemos llamar al API Proxy informando la cabecera **Authorization** de tipo **Bearer**. Dependiendo de qué scopes hayamos puesto en la petición del access token, tendremos permiso para ejecutar ciertos endpoints

-----
