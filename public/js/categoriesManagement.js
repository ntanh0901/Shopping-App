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

async function updateCategories(id, newval) {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/updateCategories?id=${id}&newval=${newval}`,
            method: 'GET',
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function deleteCategories(id) {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/deleteCategories?id=${id}`,
            method: 'GET',
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function addCategory(name) {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/addCategory?name=${name}`,
            method: 'GET',
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}