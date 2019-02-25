const BucketConfig = require('../BucketConfig')
const chai = require('chai')
const sinon = require('sinon')

const notifications = require('./fixtures/notifications.json')
const notificationsWithConfigurations = require('./fixtures/notifications_with_configurations.json')
const configurations = require('./fixtures/configurations.json')

const expect = chai.expect

describe('BucketConfig', function() {
  describe('addNewNotifications', function() {
    it('adds notifications existing only in the file to the config', function() {
      let bucketConfig = new BucketConfig(notifications.added)
      bucketConfig.addNewNotifications(configurations.added)
      expect(bucketConfig.getConfig()).to.deep.eq(notificationsWithConfigurations.added)
    })
  })

  describe('addNewNotificationsWithAliases', function() {
    it('adds notifications to aliased lambdas existing only in the file to the config', function() {
      let bucketConfig = new BucketConfig(notifications.addedWithAliases)
      bucketConfig.addNewNotifications(configurations.addedWithAliases)
      expect(bucketConfig.getConfig()).to.deep.eq(notificationsWithConfigurations.addedWithAliases)
    })
  })

  describe('removeObsoleteNotifications', function() {
    it('removes relevant notifications not in the config file', function() {
      let bucketConfig = new BucketConfig(notifications.obsolete, {
        "service": {
          "getServiceObject": sinon.stub().returns({ "name": "serverless-test" }),
          "provider": { "stage": "production" }
        }
      })
      bucketConfig.removeObsoleteNotifications(configurations.obsolete)
      expect(bucketConfig.getConfig()).to.deep.eq(notificationsWithConfigurations.obsolete)
    })
  })

  describe('removeObsoleteNotificationsWithAliases', function() {
    it('removes relevant notifications not in the config file, taking into account aliases', function() {
      let bucketConfig = new BucketConfig(notifications.obsoleteWithAliases, {
        "service": {
          "getServiceObject": sinon.stub().returns({ "name": "serverless-test" }),
          "provider": { "stage": "production" }
        }
      }, { alias: 'test_alias' })
      bucketConfig.removeObsoleteNotifications(configurations.obsoleteWithAliases)
      expect(bucketConfig.getConfig()).to.deep.eq(notificationsWithConfigurations.obsoleteWithAliases)
    })
  })
})

