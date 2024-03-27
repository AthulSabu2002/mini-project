
function approveRequest(requestId, name, email, newspaper, language) {
    window.location.href = '/admin/add-publisher?name=' + encodeURIComponent(name) +
                                '&email=' + encodeURIComponent(email) +
                                '&newspaper=' + encodeURIComponent(newspaper) +
                                '&language=' + encodeURIComponent(language);
}