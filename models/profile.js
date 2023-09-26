const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const { Schema } = mongoose;

//TODO: Likes and notifcations

// // //Likes
// const likes_schema = new Schema({
//     name: { type: String, required: false },
//     description: { type: String, required: false },
//     type: { type: String, required: false },
//     source: { type: String, required: false }
// });
//
// // //Notification
// const notification_schema = new Schema({
//     message: { type: String, required: false },
//     date: { type: String, required: false },
//     type: { type: String, required: false }
// });

//Profile
const profile_schema = new Schema({
    user_id:    {
                            type: String,
                            required: true,
                },

    first_name: {
                            type: String,
                            required: true,
                },

    last_name:  {
                            type: String,
                            required: true,
                },

    address: {
        address1: {
                            type: String
                  },
        address2:           String,
        city: {
                            type: String
              },
        state:              String,
        country: {
                            type: String
                 },
        zip_code: {
                            type: String
                  },
        latitude:           String,
        longitude:          String,
    },

    phone: {
                            type: String
           },

    gender: {
                            type: String,
                            enum: ['MALE', 'FEMALE', 'NOT_SPECIFIED']
            },

    date_of_birth:          Date,

    locale:                 String,

    type: {
                            type: String,
                            enum: ['ROOMMATE', 'TENANT']
          },

    profile_image:      {          
                            type: String,
                            default: "https://s3.us-east-2.amazonaws.com/media.roommateuy/statics/images/user.png"
                        },
    room_bookmarks:   [String],

    social_media_handles: {
                            type: Map,
                            of: String,
                          },

    my_cleanliness:    {
        type: String,
        enum: ['CLEAN', 'AVERAGE'],
    },

    my_food_preferences: {
        type: String,
        enum: ['VEGAN', 'VEGETARIAN', 'ALMOST_ANYTHING'],
    },

    my_pets:   [String],

    my_get_up_time:    String,

    my_go_to_bed_time: String,

    my_smoking_habits: Boolean,

    my_occupation:     {
                            type: String,
                            enum: ['STUDENT', 'PROFESSIONAL', 'BOTH'],
                       },

    my_overnight_guests: {
                            type: String,
                            enum: ['NEVER', 'RARELY', 'OCCASIONALLY'],
                         },

    my_party_habits:    {
                            type: String,
                            enum: ['OCCASIONALLY', 'RARELY', 'NEVER'],
                        },

    my_work_schedule:   {
                            work_in: String,
                            work_out: String,
                        },

    //TODO: check fields below

    // likes: [{ likes_schema }],

    // room_marks: [{ type: Schema.Types.ObjectId, ref: "Room", required: false }],

    // rooms: [{
    //     roomId: Schema.Types.ObjectId, ref: "Room" },
    // ],

    // rating: { type: Number, required: false },

    // system_notification: [{ notification_schema }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

profile_schema.virtual('full_name').get(() => `${this.first_name} ${this.last_name}`);

// profile_schema.post('save', (err, doc, next) => {
//     if (error.name === 'MongoError' && error.code === 11000) {
//         next(dbError(err));
//     } else {
//         next();
//     }
// });

profile_schema.plugin(mongooseDelete, { overrideMethods: true, deletedAt: true, validateBeforeDelete: false });

const Profile = mongoose.model('Profile', profile_schema);

module.exports = Profile;
