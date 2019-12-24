var assert = require('assert')
var authentication = require('../src/authentication.js')
var TokenStore = require('../src/tokenstore.js')

describe('authentication', function(){
    it('should fail with invalid credentials', function(done){

        auth_manager = authentication()
        auth_manager.setUserAuth('invalid@mail.com', 'abc123')
        auth_manager.authenticate().then(function(user_data){
            assert.fail('should not follow authentication path')

        }).catch(function(error){
            assert.deepStrictEqual(error.error, 'authentication.need_setup')
            assert.deepStrictEqual(error.details.url, 'https://login.live.com/oauth20_authorize.srf?client_id=0000000048093EE3&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf&response_type=token&display=touch&scope=service%3A%3Auser.auth.xboxlive.com%3A%3AMBI_SSL&locale=en')
            done()
        })

        assert.deepStrictEqual(auth_manager.authenticated, false);
    });

    it('should fail with invalid tokens', function(done){

        auth_manager = authentication()
        auth_manager.setTokens({
            access_token: 'invalid_access_token',
            refresh_token:  'invalid_refresh_token'
        })
        auth_manager.authenticate().then(function(user_data){
            assert.fail('should not follow authentication path')
            done()

        }).catch(function(error){
            assert.deepStrictEqual(error.error, 'authentication.failed')
            done()
        })

        assert.deepStrictEqual(auth_manager.authenticated, false)
    });

    var token_store = TokenStore()
    token_store.load()

    if(token_store.tokens != false){
        it('should succeed with valid tokens', function(done){
            auth_manager = authentication()
            auth_manager.setTokens(token_store.tokens)

            auth_manager.authenticate().then(function(user_data){
                assert.notStrictEqual(user_data.gtg, undefined)
                assert.notStrictEqual(user_data.uhs, undefined)
                assert.notStrictEqual(user_data.xid, undefined)
                assert.notStrictEqual(user_data.agg, undefined)

                assert.deepStrictEqual(auth_manager.authenticated, true);
                done()

            }).catch(function(error){
                assert.deepStrictEqual(error.error, 'authentication.failed')
                assert.fail('should not fail authentication')
                assert.deepStrictEqual(auth_manager.authenticated, true);
                done()
            })

            // @TODO:  Implement rejected login
            // assert.deepStrictEqual(auth_manager.authenticated, false);
        })
    } else {
        it('should be tested with valid tokens', function(){
            assert.fail('Skipping integration test with valid tokens')
        })
    }
})
