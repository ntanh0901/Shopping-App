async function getProducts(type, page, order, input) {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/getProducts`,
            method: 'POST',
            data: {
                type: type,
                page: page,
                orderBy: order,
                search: input
            }
        });
        return response;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function updateProducts(id, newval) {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/updateProduct`,
            method: 'POST',
            data: {
                id: id,
                newval: newval
            }
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function deleteProducts(id, imgs) {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/deleteProduct`,
            method: 'POST',
            data: {
                id: id,
                imgs: imgs
            },
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function addProducts(name, price, stock, imageslinks, type) {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/addProduct`,
            method: 'POST',
            data: {
                name: name,
                price: price,
                stock: stock,
                images: imageslinks,
                type: type
            },
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function getCategories() {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/getCategories`,
            method: 'POST'
        });
        return response;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function uploadImages(files) {
    try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('input24[]', files[i]);
        }
        const response = await $.ajax({
            url: `/admin/productsmanagement/upload`,
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function removeImages(imgs) {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/removeImage`,
            method: 'POST',
            data: {
                imgs: imgs
            }
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}