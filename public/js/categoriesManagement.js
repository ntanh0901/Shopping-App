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
            url: `/admin/productsmanagement/updateCategories`,
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

async function deleteCategories(id) {
    try {
        const response = await $.ajax({
            url: `/admin/productsmanagement/deleteCategories`,
            method: 'POST',
            data: {
                id: id
            }
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
            url: `/admin/productsmanagement/addCategory`,
            method: 'POST',
            data: {
                name: name
            }
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}