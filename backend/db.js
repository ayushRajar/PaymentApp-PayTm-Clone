const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/paytm');

const userSchema = mongoose.schema({
    firstName:String,
    lastName:String,
    password:String,
    userName:String,
})

const User = mongoose.model('User',userSchema);

const accountSchema = mongoose.schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    balance:{
        type:Number,
        required:true
    }
})

const Account = mongoose.model('Account',accountSchema);

module.exports=({
    User,Account
})