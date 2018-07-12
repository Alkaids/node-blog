module.exports = {
    formatContent(content) {
        return content.replace(/^/gm, '<p>').replace(/$/gm, '</p>')
    }
}