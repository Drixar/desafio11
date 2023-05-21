const createCards = async(data)=>{
    const response = await fetch("./templates/cards.handlebars");
    const result = await response.text();
    const template = handlebars.compile(result,{
        allowProtoPropertiesByDefault: true,
        });
    const html = template({products:data});
    return html;
}


async function page(limit, page, sort) {
    const query={};
    const [status, message, productos] = await productManager.getAllPaginated(limit, page, sort, query);
    res.render('home', {products: productos.docs, page: productos.page, prev: productos.prevPage, next: productos.nextPage, limit: limit, sort:sort, query: query});
}

const productsContainer = document.getElementById("productsContainer");
const htmlProducts = createCards(products);
productsContainer.innerHTML = htmlProducts;

