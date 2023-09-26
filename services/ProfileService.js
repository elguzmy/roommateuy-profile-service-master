const Profile = require('../models/profile');
const Suggestion = require('../models/suggestion');
const { missingParam, dbError, notFound, errorType } = require('../lib/errorManagement');
const logger = require('../lib/utils/logger');

class ProfileService {
    async createProfile({ profileData }) {
        try {
            return await Profile.create(profileData);
        } catch (err) {
            throw dbError(err);
        }
    }

    async getProfiles({ deleted = false } = {}) {
        try {
            return await !deleted ? Profile.find({}) : Profile.findWithDeleted({});
        } catch (err) {
            throw dbError(err);
        }
    }

    async getProfileById({ id, showDeleted = false }) {
        if (!id) {
            throw missingParam({ param: 'id' });
        }

        try {
            const profile = await !showDeleted ? Profile.findById(id) : Profile.findOneWithDeleted({ _id: id });

            if (!profile) {
                throw notFound();
            }

            return profile;
        } catch (err) {
            if (!err.type || err.type !== errorType.APPLICATION) {
                throw dbError(err);
            } else {
                throw err;
            }
        }
    }

    async getProfileByEmail({ email }) {
        if (!email) {
            throw missingParam({ param: 'email' });
        }

        try {
            const profile = await Profile.findOne({ email });

            if (!profile) {
                throw notFound();
            }

            return profile;
        } catch (err) {
            if (!err.type || err.type !== errorType.APPLICATION) {
                throw dbError(err);
            } else {
                throw err;
            }
        }
    }

    async getProfileByUserId({ user_id }) {
        if (!user_id) {
            throw missingParam({ param: 'user_id' });
        }

        try {
            const profile = await Profile.findOne({ user_id }).select('-__v -_id');

            if (!profile) {
                throw notFound();
            }

            return profile;
        } catch (err) {
            if (!err.type || err.type !== errorType.APPLICATION) {
                throw dbError(err);
            } else {
                throw err;
            }
        }
    }

    async updateProfileByUserId({ profileData, user_id }) {
        if (!user_id) {
            throw missingParam({ param: 'user_id' });
        }

        try {
            const profile = await Profile.findOneAndUpdate({ user_id }, profileData);

            if (!profile) {
                throw notFound();
            }

            return profile;
        } catch (err) {
            if (!err.type || err.type === errorType.DB) {
                throw dbError(err);
            } else {
                throw err;
            }
        }
    }

    async deleteProfileByUserId({ user_id }) {
        if (!id) {
            throw missingParam({ param: 'user_id' });
        }

        try {
            const profile = await Profile.findOne({ user_id });

            if (!profile) {
                throw notFound();
            }

            await profile.delete();
        } catch (err) {
            if (!err.type || err.type === errorType.DB) {
                throw dbError(err);
            } else {
                throw err;
            }
        }
    }

    //Profiles Suggestions
    async createSuggestionJob({ user_id }) {
        try {
            await Suggestion.findOneAndDelete({ user_id });

            const createSuggestionModel = await Suggestion.create({ user_id });

            this.getProfileSuggestions({ user_id })

            return createSuggestionModel;
        } catch (err) {
            throw dbError(err);
        }
    }

    async getSuggestionResult({ user_id }) {
        if (!user_id) {
            throw missingParam({ param: 'user_id' });
        }

        try {
            const profileSuggestion = await Suggestion.findOne({ user_id });

            if (!profileSuggestion) {
                throw notFound();
            }

            return profileSuggestion;
        } catch (err) {
            if (!err.type || err.type !== errorType.APPLICATION) {
                throw dbError(err);
            } else {
                throw err;
            }
        }
    }

    //Update
    async updateProfileSuggestion({ user_id }, resultData) {
        if (!user_id) {
            throw missingParam({ param: 'user_id' });
        }

        try {
            const profileSuggestion = await Suggestion.findOneAndUpdate({ user_id }, resultData);

            if (!profileSuggestion) {
                throw notFound();
            }

            return profileSuggestion;
        } catch (err) {
            if (!err.type || err.type === errorType.DB) {
                throw dbError(err);
            } else {
                throw err;
            }
        }
    }

    async getProfileSuggestions({ user_id }) {
        try {
            const currentProfile = await this.getProfileByUserId({ user_id });
            const allProfiles = await this.getProfiles();

            if (currentProfile && allProfiles) {
                allProfiles.forEach(profile => {
                    let sum = 0;

                    if (profile.user_id === user_id) return true;

                    if (profile.my_cleanliness && currentProfile.my_cleanliness) {
                        if (profile.my_cleanliness === currentProfile.my_cleanliness) {
                            sum = sum + 1;
                        }
                    }

                    if (profile.my_food_preferences && currentProfile.my_food_preferences) {
                        if (profile.my_food_preferences === currentProfile.my_food_preferences) {
                            sum = sum + 1;
                        }
                    }

                    if (profile.my_get_up_time && currentProfile.my_get_up_time) {
                        if (profile.my_get_up_time === currentProfile.my_get_up_time) {
                            sum = sum + 1;
                        }
                    }

                    if (profile.my_go_to_bed_time && currentProfile.my_go_to_bed_time) {
                        if (profile.my_go_to_bed_time === currentProfile.my_go_to_bed_time) {
                            sum = sum + 1;
                        }
                    }

                    if (profile.my_occupation && currentProfile.my_occupation) {
                        if (profile.my_occupation === currentProfile.my_occupation) {
                            sum = sum + 1;
                        }
                    }

                    if (profile.my_overnight_guests && currentProfile.my_overnight_guests) {
                        if (profile.my_overnight_guests === currentProfile.my_overnight_guests) {
                            sum = sum + 1;
                        }
                    }

                    if (profile.my_party_habits && currentProfile.my_party_habits) {
                        if (profile.my_party_habits === currentProfile.my_party_habits) {
                            sum = sum + 1;
                        }
                    }

                    if (profile.my_smoking_habits && currentProfile.my_smoking_habits) {
                        if (profile.my_smoking_habits === currentProfile.my_smoking_habits) {
                            sum = sum + 1;
                        }
                    }

                    let avg = (sum * 100) / 8;

                    if (avg > 60) {
                        this.updateProfileSuggestion({ user_id }, { $push: { "result": { profile, avg } } });
                    }
                });
                this.updateProfileSuggestion({ user_id }, { "status": "COMPLETED" });
            }

        } catch (err) {
            if (!err.type || err.type !== errorType.APPLICATION) {
                throw dbError(err);
            } else {
                throw err;
            }
        }
    }
}

module.exports = ProfileService;
