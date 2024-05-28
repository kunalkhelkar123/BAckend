const express = require("express");

const router = express.Router();
const PropertyDetails = require("../models/PropertyDetails");
const { verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Save uploaded files to the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename to make it unique
  },
});

const upload = multer({ storage: storage });

router.post(
  "/propertyDetails",
  upload.single("featureImage"),
  async (req, res) => {
    try {
      const {
        propertyTitle,
        propertyType,
        propertyDescription,
        propertyID,
        parentProperty,
        builderName,
        status,
        label,
        material,
        rooms,
        bedsroom,
        kitchen,
        bhk,
        yearBuilt,
        totalhomeArea,
        builtDimentions,
        openArea,
        price,
        location,
        area,
        pinCode,
        // featureImage,
        amenities,
      } = req.body;
      const featureImage = req.file.filename; //// new line
      // Create a new PropertyDetails document
      const newPropertyDetails = new PropertyDetails({
        propertyTitle,
        propertyType,
        propertyDescription,
        builderName,
        propertyID,
        parentProperty,
        status,
        label,
        material,
        rooms,
        bedsroom,
        kitchen,
        bhk,
        yearBuilt,
        totalhomeArea,
        builtDimentions,
        openArea,
        price,
        location,
        area,
        pinCode,
        featureImage,
        amenities,
      });

      // Save the new PropertyDetails document to the database
      const savedPropertyDetails = await newPropertyDetails.save();
      res.status(201).json(savedPropertyDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// get count of properties
router.get("/property-count", async (req, res) => {
  try {
    const totalProperties = await PropertyDetails.countDocuments();
    res.status(200).json({ totalProperties });
  } catch (error) {
    res.status(500).json({ error: "Fail to calculate Total user" });
  }
});

//// get all property details

router.get("/properties", async (req, res) => {
  try {
    const property = await PropertyDetails.find();
    res.status(200).json(property);
    console.log("ok");
  } catch (error) {
    console.log("error");

    res.status(500).json({ message: error.message });
  }
});

//// get single property details
router.get("/properties/:id", async (req, res) => {
  try {
    const property = await PropertyDetails.findById(req.params.id);
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

//  Edit Properties
router.put(
  "/propertyDetails/:id",
  upload.single("featureImage"),
  async (req, res) => {
    try {
      const property = await PropertyDetails.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const {
        propertyTitle,
        propertyType,
        propertyDescription,
        builderName,
        propertyID,
        parentProperty,
        status,
        label,
        material,
        rooms,
        bedsroom,
        kitchen,
        bhk,
        yearBuilt,
        totalhomeArea,
        builtDimentions,
        openArea,
        price,
        location,
        area,
        pinCode,
        amenities,
      } = req.body;

      // Check if a new image is uploaded
      if (req.file) {
        const newFeatureImage = req.file.filename;

        // Delete old image from the file system
        if (property.featureImage) {
          fs.unlink(
            path.join(__dirname, "../uploads", property.featureImage),
            (err) => {
              if (err) console.error(err);
            }
          );
        }

        property.featureImage = newFeatureImage;
      }

      // Update other fields
      property.propertyTitle = propertyTitle;
      property.propertyType = propertyType;
      property.propertyDescription = propertyDescription;
      property.propertyID = propertyID;
      property.parentProperty = parentProperty;
      property.builderName = builderName;
      property.status = status;
      property.label = label;
      property.material = material;
      property.rooms = rooms;
      property.bedsroom = bedsroom;
      property.kitchen = kitchen;
      property.bhk = bhk;
      property.yearBuilt = yearBuilt;
      property.totalhomeArea = totalhomeArea;
      property.builtDimentions = builtDimentions;
      property.openArea = openArea;
      property.price = price;
      property.location = location;
      property.area = area;
      property.pinCode = pinCode;
      property.amenities = amenities;

      const updatedPropertyDetails = await property.save();

      res.status(200).json(updatedPropertyDetails);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Delete Property
router.delete("/propertyDetails/:id", async (req, res) => {
  try {
    const property = await PropertyDetails.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Delete image from the file system
    if (property.featureImage) {
      fs.unlink(
        path.join(__dirname, "../uploads", property.featureImage),
        (err) => {
          if (err) console.error(err);
        }
      );
    }

    await PropertyDetails.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json(error);
  }
});

//// get only residential  property details
router.get("/residential_properties", async (req, res) => {
  try {
    const residentialProperties = await PropertyDetails.find({
      propertyType: "Resedentil",
    });
    res.status(200).json(residentialProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//// get only Commercial property details
router.get("/Commercial_properties", async (req, res) => {
  try {
    const residentialProperties = await PropertyDetails.find({
      propertyType: "Commercial",
    });
    res.status(200).json(residentialProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//// get all property details with filters using search button
router.post("/filter_properties", async (req, res) => {
  try {
    const { area, bhk, price } = req.body;
    // Define filter object
    const filters = {};
    // Apply filters if they exist
    if (area) filters.area = area;
    if (bhk) filters.bhk = bhk;
    if (price) filters.price = price;
    // Find properties based on filters
    const properties = await PropertyDetails.find(filters);
    res.status(200).json(properties);
    console.log("details ", properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//// get  property details base on builder name
router.get("/properties/builderName/:buildername", async (req, res) => {
  try {
    const property = await PropertyDetails.find({
      builderName: req.params.builderName,
    });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

module.exports = router;
