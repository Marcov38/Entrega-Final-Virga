!localStorage.getItem("productos") && localStorage.setItem("productos", "")

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
    }
}


const addCarrito = (id) => {
    const actualStorage = localStorage.getItem('productos').split(';');
    actualStorage.push(id);
    localStorage.setItem('productos', actualStorage.join(';'));

    const productHtml = document.getElementById(id).getElementsByClassName('card-body')[0];
    productHtml.removeChild(productHtml.getElementsByTagName('button')[0]);
    const newBtn = document.createElement('div')
    newBtn.innerHTML = `<button type='button' class="btn btn-secondary" onclick="removeCarrito('${id}')">Remover del carrito</a>`
    productHtml.appendChild(newBtn.firstChild);

    actualizarCarrito()
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

renderProductos()