const mongoose =require('mongoose');

const hotelSchema=new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    mapLink: { type: String },
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    owner:{type:mongoose.Schema.Types.ObjectID,ref:'User'},
    approved:{type:Boolean,default:false},
    contactEmail:{type:String,required:true},
    contactNumber:{type:String,required:true},

});

module.exports=mongoose.model('Hotel',hotelSchema);