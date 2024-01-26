function getCategories(callback) {
    $.ajax({
        url: `/productsmanagement/getCategories`,
        method: 'POST',
        success: function (data) {
            if (data)
                callback(null, data);
            else
                callback(null, null);
        },
        error: function (err) {
            console.error('Error fetching data:', err);
            callback(err, null);
        }
    });
}

function updateCategories(id, newval, callback) {
    $.ajax({
        url: `/productsmanagement/updateCategories?id=${id}&newval=${newval}`,
        method: 'GET',
        success: function (data) {
            if (data)
                callback(null, true);
            else
                callback(null, false);
        },
        error: function (err) {
            console.error('Error fetching data:', err);
            callback(err, null);
        }
    });
}

function deleteCategories(id, callback) {
    $.ajax({
        url: `/productsmanagement/deleteCategories?id=${id}`,
        method: 'GET',
        success: function (data) {
            if (data)
                callback(null, data);
            else
                callback(null, null);
        },
        error: function (err) {
            console.error('Error fetching data:', err);
            callback(err, null);
        }
    });
}