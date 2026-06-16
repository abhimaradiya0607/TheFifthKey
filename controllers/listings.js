const { response } = require('express');
const Listing=require('../models/listing.js')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({
    accessToken: mapToken
  });

//Index ROute
module.exports.index=async (req, res) => {
    let allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings })
}

//New Listing form
module.exports.newForm=(req, res) => {
    res.render('listings/new.ejs')
}

//Show Particular Listing
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
            populate:{
                path:"author",
    },
})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested does not exist");
        return res.redirect('/listing');
    }
    console.log(listing)
    res.render('listings/show.ejs', { listing })
}

module.exports.newListing=async (req, res) => {

    let response= await geocodingClient.forwardGeocode({
        query: 'Ahmedabad,India',
        limit: 1
      })
        .send()

        console.log(response);
        res.send('Done');
        
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={filename,url};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect('/listing')
}

module.exports.listingUpdateform=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect('/listing');
    }
    let originalImage=listing.image.url;
    const optimized_image=originalImage.replace(
        "/upload/",
        "/upload/w_200,h_250,c_fill,q_30,e_blur:300//"
    )
    res.render('listings/edit.ejs', { listing ,optimized_image})
}

module.exports.listingupadtesaved=async (req, res) => {
    let { id } = req.params;
    let updatedListing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={url,filename};
        await updatedListing.save();
    }
    if (!updatedListing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect('/listing');

    }
    req.flash("info", "Listing Updated Successfully");
    res.redirect(`/listing/${id}`);
}

module.exports.listingDelete=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("error", "Listing Deleted Successfully");
    console.log('Listing Deleted', deletedListing);
    res.redirect('/listing');
}