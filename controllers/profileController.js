const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const bluebird = require('bluebird');

const { ProfileService } = require('../services');
const { notFound, error } = require('../lib/errorManagement');
const config = require('../lib/config');

AWS.config.update({
    accessKeyId: config.aws.awsAccessKey,
    secretAccessKey: config.aws.awsAccessSecret,
    region: config.aws.awsRegion,
});

AWS.config.setPromisesDependency(bluebird);

const profileService = new ProfileService();
const s3 = new AWS.S3();

const getProfiles = async (req, res, next) => {
    try {
        const profiles = await profileService.getProfiles();

        res.status(200).json(profiles);
    } catch (e) {
        next(e);
    }
};

const getProfileById = async (req, res, next) => {
    const id = req.query && req.query.id || req.params && req.params.id;

    try {
        const profile = await profileService.getProfileById({ id });

        if (!profile) {
            return next(notFound())
        } else {
            res.status(200).json(profile);
        }
    } catch (e) {
        next(e);
    }
};

const getProfileByEmail = async (req, res, next) => {
    const email = req.query && req.query.email;

    try {
        const profile = await profileService.getProfileByEmail({ email });

        if (!profile) {
            return next(notFound())
        } else {
            res.status(200).json(profile);
        }
    } catch (e) {
        next(e);
    }
};

const getProfileByUserId = async (req, res, next) => {
    let user_id;

    if (req.query && req.query.user_id) {
        user_id = req.query.user_id;
    } else if (req.params && req.params.user_id) {
        user_id = req.params.user_id;
    }

    try {
        const profile = await profileService.getProfileByUserId({ user_id });

        if (!profile) {
            return next(notFound())
        } else {
            res.status(200).json(profile);
        }
    } catch (e) {
        next(e);
    }
};

const createProfile = async (req, res, next) => {
    const profileData = req.body;

    try {
        await profileService.createProfile({ profileData });
        res.sendStatus(201);
    } catch (e) {
        next(e);
    }
};

const updateProfileByUserId = async (req, res, next) => {
    const profileData = req.body;
    const { user_id } = req.params;

    if (req.user && req.user.user_id && (req.user.user_id !== user_id)) {
        return next(error({ message: 'Invalid profile for logged in user', statusCode: 400, errorCode: 'ERR_INVALID_PROFILE' }));
    }

    try {

        if (profileData && profileData.user_id) {
            delete profileData.user_id;
        }

        await profileService.updateProfileByUserId({ profileData, user_id });
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

const deleteProfileByUserId = async (req, res, next) => {
    const { user_id } = req.params;

    if (req.user && req.user.user_id && (req.user.user_id !== user_id)) {
        return next(error({ message: 'Invalid profile for logged in user', statusCode: 400, errorCode: 'ERR_INVALID_PROFILE' }));
    }

    try {
        await profileService.deleteProfileByUserId({ user_id });
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

const uploadProfileImage = async (req, res, next) => {
    const { user_id } = req.params;

    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return next(error({ message: err.message, errorCode: 'ERR_FILE_UPLOAD', statusCode: 400 }));
        }

        console.log(files);

        try {
            const file = files.file[0];

            if (!file) {
                return next(error({ message: 'file is empty', errorCode: 'ERR_FILE_UPLOAD_EMPTY', statusCode: 400 }));
            }

            const path = file.path;
            const size = file.size;

            if (size > 5e+6) {
                return next(error({ message: 'File max size is 5mb', errorCode: 'ERR_FILE_UPLOAD_SIZE', statusCode: 400 }));
            }

            const buffer = fs.readFileSync(path);
            const type = fileType(buffer);
            const timestamp = Date.now().toString();
            const fileName = `profile/${user_id}/profile-${timestamp}`;

            if (type.mime !== 'image/jpeg' && type.mime !== 'image/jpg' && type.mime !== 'image/png') {
                return next(error({ message: 'Invalid file type', errorCode: 'ERR_FILE_UPLOAD_INVALID_TYPE', statusCode: 400 }));
            }

            // const metadata = {
            //     'userId': req.params.user_id,
            // };
            const data = await _uploadFile(buffer, fileName, type);

            await profileService.updateProfileByUserId({ profileData: { profile_image: data.Location }, user_id });

            return res.status(200).json({ profile_image: data.Location });
        } catch (e) {
            return next(error({ message: e.message, errorCode: 'ERR_FILE_UPLOAD', statusCode: 400 }));
        }
    });
};

const _uploadFile = (buffer, name, type, metadata = {}) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: config.aws.s3.bucket,
        ContentType: type.mime,
        Key: `${name}.${type.ext}`,
    };

    return s3.upload(params).promise();
};

const createSuggestionJob = async (req, res, next) => {
    const { user_id } = req.params;

    try {
        await profileService.createSuggestionJob({ user_id });
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

const getSuggestionResult = async (req, res, next) => {
    const { user_id } = req.params;

    try {
        const profileSuggestions = await profileService.getSuggestionResult({ user_id });

        res.status(200).json(profileSuggestions);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    getProfileById,
    getProfileByEmail,
    getProfiles,
    createProfile,
    updateProfileByUserId,
    deleteProfileByUserId,
    getProfileByUserId,
    uploadProfileImage,
    createSuggestionJob,
    getSuggestionResult
};
