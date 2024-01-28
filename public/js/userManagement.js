async function getAccounts(page, searchinput, sortOrder) {
    try {
        const response = await $.ajax({
            url: `/admin/accountsmanagement/getAccounts`,
            method: 'POST',
            data: {
                page: page,
                searchinput: searchinput,
                orderBy: sortOrder
            }
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
            url: `/admin/accountsmanagement/addAccount`,
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

async function uploadAvt(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await $.ajax({
            url: `/admin/accountsmanagement/upload`,
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

async function removeAvt(imgs) {
    try {
        const response = await $.ajax({
            url: `/admin/accountsmanagement/removeImage`,
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