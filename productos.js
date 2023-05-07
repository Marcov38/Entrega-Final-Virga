!localStorage.getItem("productos") && localStorage.setItem("productos", "")
!localStorage.getItem("cotizacion") && localStorage.setItem("cotizacion", "")

const productos = [
    {
        id: 'tarjeta1',
        title: 'Tarjeta cumpleaños 1', 
        img: '../assets/Tarjeta1.png', 
        desc: "Todos los colores de las letras y formato de las mismas son modificables al 100%",
        precio: 2500
    },

    {
        id: 'tarjeta2',
        title: 'Tarjeta cumpleaños 2', 
        img: '../assets/Tarjeta2.png', 
        desc: "Todos los colores de las letras y formato de las mismas son modificables al 100%",
        precio: 3500
    },

    {
        id: 'tarjeta3',
        title: 'Tarjeta cumpleaños 3', 
        img: '../assets/Tarjeta3.jpg', 
        desc: "Todos los colores de las letras y formato de las mismas son modificables al 100%",
        precio: 4000
    },

    {
        id: 'tarjeta4',
        title: 'Tarjeta de boda 1', 
        img: '../assets/Tarjeta4.jpg', 
        desc: "Todos los colores de las letras y formato de las mismas son modificables al 100%",
        precio: 6000
    },

    {
        id: 'tarjeta5',
        title: 'Tarjeta de boda 2', 
        img: '../assets/Tarjeta5.jpg', 
        desc: "Todos los colores de las letras y formato de las mismas son modificables al 100%",
        precio: 7000
    },

    {
        id: 'tarjeta6',
        title: 'Tarjeta de boda 3', 
        img: '../assets/Tarjeta6.jpg', 
        desc: "Todos los colores de las letras y formato de las mismas son modificables al 100%",
        precio: 8000
    },
]


const mostrarPrecios = () => {
    // calculo subtotal
    const listId = localStorage.getItem('productos').split(';')
    const productEnCarrito = productos.filter(x => listId.includes(x.id));
    const subtotal = productEnCarrito.reduce((prev, curr) => prev+=curr.precio, 0)
    // obtengo los datos de dolar y euro blue promedios
    const data = JSON.parse(localStorage.getItem("cotizacion"))
    const precioDolar = Number(subtotal) / data.blue.value_avg 
    const precioEuro = Number(subtotal) / data.blue_euro.value_avg
    Swal.fire({
        title: '<h1>Confirmar compra</h1>',
        icon: 'success',
        html:
          `<ul class="finalizar-compra">
          <li><b>Precio Dolar:</b> ${precioDolar.toFixed(2)}US$</li>
          <li><b>Precio Euro:</b> ${precioEuro.toFixed(2)}€</li>
          <li><b>Precio Pesos:</b> $${subtotal.toFixed(2)}</li>
          </ul>`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
          '<i class="boton-aceptacompra" onclick="alertaToast(`Compra finalizada`)">Aceptar</i>',
        cancelButtonText:
          '<i class="boton-rechazacompra" onclick="alertaToast(`Seguir eligiendo productos!`)">Cancelar</i>',
      })
}

const actualizarCarrito = () => {
    // Obtengo ids del localstorage
    const listId = localStorage.getItem('productos').split(';')
    // Consigo todo los objetos productos de la lista de id
    const productEnCarrito = productos.filter(x => listId.includes(x.id));
    // Actualizo el numero total de items en el carrito
    document.getElementById("cart-total").innerText=productEnCarrito.length;

    const cartListContainer = document.querySelector('#cart-list-container');
    const cartListTitle = cartListContainer.querySelector('#cart-list-title');
    const cartListItems = cartListContainer.querySelector('#cart-list-items');

    if(productEnCarrito.length) {
        // Si hay items pongo titulo que contiene items
        cartListTitle.innerText = 'Su carrito contiene:';
        // Si hay items añadir items en la lista
        cartListItems.innerHTML = "";
        productEnCarrito.forEach(producto => {
            const item = document.createElement('li');
            item.innerText = producto.title;
            cartListItems.appendChild(item)
        })
        // Si hay items añadir el precio total
        const cartListPrecio = cartListContainer.querySelector('#cart-list-precio');
        const subtotal = productEnCarrito.reduce((prev, curr) => prev+=curr.precio, 0)
        if(cartListPrecio) {
            cartListPrecio.textContent = `Subtotal: $${subtotal}`;
        } else {
            const precioText = document.createElement('h4');
            precioText.setAttribute('id', 'cart-list-precio')
            precioText.setAttribute('class', 'cart-list-subtotal')
            precioText.textContent= `Subtotal: $${subtotal}`
            cartListContainer.appendChild(precioText)
        }
        // Si hay items añadir el boton de finalizar compra
        if(!document.querySelector('#cart-list-boton-finalizar')) {
            const botonFinalizar = document.createElement('div');
            botonFinalizar.setAttribute('id', 'cart-list-boton-finalizar')
            botonFinalizar.setAttribute('class', 'd-grip gap-2')
            botonFinalizar.innerHTML = `<button class="btn btn-primary" type="button" onclick="mostrarPrecios()">Finalizar Compra</button>`
            cartListContainer.appendChild(botonFinalizar)
        }
    } else {
        // Sino poner que no hay items
        cartListTitle.innerText = 'Su carrito esta vacio';
        // Sino limpiar la lista
        cartListItems.innerHTML = '';
        // Si existe el texto precio, eliminarlo
        const cartListPrecio = cartListContainer.querySelector('#cart-list-precio');
        if(cartListPrecio) {
            cartListPrecio.remove()
        }
        const botonFinalizar = document.querySelector('#cart-list-boton-finalizar');
        botonFinalizar && botonFinalizar.remove()
    }
}

const addCarrito = (id) => {
    const actualStorage = localStorage.getItem('productos').split(';');
    actualStorage.push(id);
    localStorage.setItem('productos', actualStorage.join(';'));

    const productHtml = document.getElementById(id).getElementsByClassName('card-body')[0];
    productHtml.removeChild(productHtml.getElementsByTagName('button')[0]);
    const newBtn = document.createElement('div')
    newBtn.innerHTML = `<button type='button' class="btn btn-secondary" onclick="removeCarrito('${id}') ">Remover del carrito</a>`
    productHtml.appendChild(newBtn.firstChild);
    actualizarCarrito()
    alertaToast('Añadido al carrito')
}

const removeCarrito = (id) => {
    const actualStorage = localStorage.getItem('productos').split(';');
    localStorage.setItem('productos', actualStorage.filter(x => x !== id).join(';'));

    const productHtml = document.getElementById(id).getElementsByClassName('card-body')[0];
    productHtml.removeChild(productHtml.getElementsByTagName('button')[0]);
    const newDiv = document.createElement('div') //<div></div>
    newDiv.innerHTML = `<button type='button' class="btn btn-primary" onclick="addCarrito('${id}')">Añadir al carrito</a>` //<div> button </div>
    productHtml.appendChild(newDiv.firstChild) // <div class="card-body">...childs+button</div>
        
    actualizarCarrito()
    alertaToast('Eliminado del carrito')
}

const checkCarrito = (id) => {
    const arrayProducts = localStorage.getItem('productos').split(';')
    return arrayProducts.some(prod => prod===id)
}

const renderProductos = () => {
    const newHtml = productos.map(producto => {
        const carritoButton = checkCarrito(producto.id) ? 
            `<button type='button' class="btn btn-secondary" onclick="removeCarrito('${producto.id}')">Remover del carrito</a>` :
            `<button type='button' class="btn btn-primary" onclick="addCarrito('${producto.id}')">Añadir al carrito</a>`;

        return `<article class="tarjeta" id="${producto.id}">
            <div class="card">
                <img class="card-img-top" src="${producto.img}" alt="${producto.title}">
                <div class="card-body">
                    <h5 class="card-title"><b>${producto.title}</b></h5>
                    <p class="card-text">${producto.desc}</p>
                    <p class="card-text">El precio es: $${producto.precio}</p>
                    ${carritoButton}
                </div>
            </div>
        </article>`
    })

    const productContainer = document.getElementById('productos-container')
    productContainer.innerHTML = newHtml.join('')
    actualizarCarrito()
}

const alertaToast = (mensaje) => {
    Toastify({
        text: mensaje,
        duration: 1500,
        close: true,
        gravity: "top", 
        position: "center",
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#198754",
          color: '$white',
          'font-size': '16px',
          'font-weight': 'bolder',
        }
      }).showToast();
}

const getCotizaciones = () => {
    const cotizacionCache = localStorage.getItem("cotizacion");
    // Verificar la cotizacion guardada en local - Max 1Dia 
    if(cotizacionCache) {
        const cacheData = JSON.parse(localStorage.getItem("cotizacion"));
        const previousDate = new Date(cacheData.last_update);
        previousDate.setDate(previousDate.getDate() + 1 );
        if(previousDate.getTime() > new Date().getTime()) return
    }
    fetch('https://api.bluelytics.com.ar/v2/latest')
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem("cotizacion", JSON.stringify(data))
    })
}

renderProductos()
getCotizaciones()
