const mongoose = require('mongoose');

const layoutSchema = new mongoose.Schema({
    newspaperName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    layoutName: {
        type: String,
        required: true
    }
});

const Layout = mongoose.model('Layout', layoutSchema);

module.exports = Layout;
