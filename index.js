
const form = document.getElementById('new_product');
form.addEventListener('submit', newProduct);

const btnAllProd = document.getElementById('btnAllProduct');
const body_product = document.getElementById('body_product');

let xhr = new XMLHttpRequest();

function loadProducts(obj) {
    let prodBlock = document.createElement('div');

    let btnDelete = document.createElement('button');

    btnDelete.addEventListener('click', (event)=> {                      //Удаление карточки товара при нажатии на кнопку
        event.preventDefault();
        xhr.open('DELETE', 'http://localhost:3000/files/:id'); 
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            console.log(xhr.response);
        }
        xhr.send(JSON.stringify(obj._id));
    });

    prodBlock.classList.add('prodBlock');
    prodBlock.setAttribute('id',`prod${obj._id}`);
    
    prodBlock.innerHTML = `
        <div class='imgProd'><img src=${obj.path}></img></div>
        <div class='nameProd'><span>${obj.name}</span></div>
        <div class='priceProd'><span>${obj.price} руб. за 1 ${obj.product_unit}</span></div>`
  

    prodBlock.appendChild(btnDelete);
        
    body_product.appendChild(prodBlock);
}


function newProduct(event) {                        // Создание нового товара
    event.preventDefault();
    const formData = new FormData(form); //Создаем объект в который копируем все данные из формы

    xhr.open('POST', 'http://localhost:3000/form');
    xhr.onload = () => {
        console.log(xhr.response);
        console.log('Товар добавлен в базу');
    }
    xhr.send(formData);
}

window.addEventListener('load', () => {      // Отображение товаров в БД на странице
    xhr.open('GET', 'http://localhost:3000/getAllProducts');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        const tempBase = (JSON.parse(xhr.response));
        for (let i =0; i < tempBase.length; i++) {
            loadProducts(tempBase[i]);
        }
    }
    xhr.send();

});
