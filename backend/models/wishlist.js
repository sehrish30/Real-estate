const mongoose = require("mongoose");
const schema = mongoose.Schema;

const wishlistSchema = new schema({
  property_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    default: Date.now,
  },
});

// exports.Wishlist = mongoose.model("Wishlist", wishlistSchema);
const wishlist = (module.exports =
  mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema));

module.exports.getWishlistByUserIds = function (user_id) {
  const query = {
    user_id: user_id,
  };
  return wishlist.findOne(query);
};
// exports.Category = mongoose.model("Wishlist", wishlistSchema);

module.exports.getWishlistByUserId = function (user_id) {
  //console.log(eq);
  return wishlist
    .aggregate([
      {
        $addFields: {
          id: "$_id",
          property_id: {
            $toObjectId: "$property_id",
          },
        },
      },
      {
        $match: { user_id: user_id },
      },
      {
        $lookup: {
          from: "properties",
          let: {
            propertyId: "$property_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$propertyId"],
                },
              },
            },
            {
              // project block for PROFILE
              $project: {
                _id: false,
                id: "$_id",
                title: true,
                cost: true,
                images: true,
                location: true,
                network: true,
                bathrooms: true,
                category: true,
                iBanNumber: true,
                description: true,
                Amenities: true,
                rooms: true,
                type: true,
                area: true,
                city: true,
                propertyImages: true,
              },
            },
          ],
          as: "property",
        },
      },
      { $unwind: "$property" },
      {
        // project block for ACCOUNTS
        $project: {
          _id: false,
          id: "$_id",
          created_at: true,
          property: true,
        },
      },
    ])
    .sort({ created_at: -1 }); //.skip(parseInt(offset)).limit(parseInt(limit));
};
