const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const setupTestApp = require('../../../lib/utils/setupTestApp');
const profileController = require('../../../controllers/profileController');
const { ProfileService } = require('../../../services');
const profileMocks = require('../fixtures/profiles');

const sandbox = sinon.createSandbox();

describe('unit:controllers:profileController', () => {
    let app;
    let errorSpy;

    describe('profileController:getProfileById', () => {
        beforeEach(() => {
            [app, errorSpy] = setupTestApp({
                route: {
                    method: 'get',
                    path: '/:id',
                    middleware: profileController.getProfileById,
                },
            });
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should return 200 and the profile, profile id found', () => {
            const profileMock = profileMocks.profile1;

            sandbox.stub(ProfileService.prototype, 'getProfileById').resolves(profileMock);

            return request(app)
                .get('/12345')
                .set('Accept', 'application/json')
                .expect(200)
                .then((res) => {
                    expect(errorSpy.callCount).to.equal(0);
                    expect(res.body).to.deep.equal(profileMock);
                });
        });
    });

    describe('profileController:getProfiles', () => {
        beforeEach(() => {
            [app, errorSpy] = setupTestApp({
                route: {
                    method: 'get',
                    path: '/',
                    middleware: profileController.getProfiles,
                },
            });
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should return 200 and a list of profiles, profile id found', () => {
            const profilesMock = Object.keys(profileMocks).map(profile => profileMocks[profile]);

            sandbox.stub(ProfileService.prototype, 'getProfiles').resolves(profilesMock);

            return request(app)
                .get('/')
                .set('Accept', 'application/json')
                .expect(200)
                .then((res) => {
                    expect(errorSpy.callCount).to.equal(0);
                    expect(res.body).to.deep.equal(profilesMock);
                });
        });
    });
});
