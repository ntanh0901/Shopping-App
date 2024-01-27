async function getAccounts(page) {
    try {
        const response = await $.ajax({
            url: `/admin/accountsmanagement/getAccounts?page=${page}`,
            method: 'GET'
        });
        return response;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function updateAccount(id, newval) {
    try {
        const response = await $.ajax({
            url: `/admin/accountsmanagement/updateAccount`,
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

async function deleteAccount(id, imgs) {
    try {
        const response = await $.ajax({
            url: `/admin/accountsmanagement/deleteAccount`,
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

async function addAccount(acc) {
    try {
        const response = await $.ajax({
            url: `/admin/accountsmanagement/addProduct`,
            method: 'POST',
            data: {
                acc: acc
            },
        });
        return response;
    }
    catch (err) {
        console.error('Error fetching data:', err);
    }
}