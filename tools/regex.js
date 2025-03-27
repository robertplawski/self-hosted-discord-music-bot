const extractIdFromUrl = (url) => {
    const match = url.match(/(?<=v=)[^&]{11}/);
    if(!match){
        return;
    }
    const id = match[0];
    return id;
}

module.exports = {extractIdFromUrl}