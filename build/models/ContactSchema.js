import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
    whos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    loaction: { type: String, required: true },
    status: { type: String, required: true },
});
const Contact = mongoose.model('Order', OrderSchema);
export default Contact;
//# sourceMappingURL=ContactSchema.js.map