const mongoose = require("mongoose");


const PropertyDetailsSchema = mongoose.Schema({
propertyTitle:{type:String},
propertyType:{type:Array},
propertyDescription:{type:String},
propertyID:{type:String},
parentProperty:{type:String},
builderName:{type:String},
status:{type:String},
label:{type:Array},
material:{type:Array},
rooms:{type:Number},
bedroom:{type:Number},
kitchen:{type:Number},
bhk:{type:String},
yearBuilt:{type:Number},
totalhomeArea:{type:String},
builtDimentions:{type:String},
openArea:{type:String},
price:{type:String},

location:{type:String},
area:{type:String},
pinCode:{type:String},
featureImage:{type:String},

amenities:{type:Array},

},
{timestamps:true}
);

module.exports = mongoose.model("PropertyDetails",PropertyDetailsSchema);