var XboxApiClient = require('../src/client')

var client = XboxApiClient({
    clientId: '5e5ead27-ed60-482d-b3fc-702b28a97404'
})

client.isAuthenticated().then(function(token){
    // User is authenticated
    console.log('User is authenticated.')

}).catch(function(error){
    // User is not authenticated
    console.log('User is not authenticated. Starting flow...')
    var url = client.startAuthServer(function(){
        console.log('Authentication is done. User logged in')
    })
    console.log('Open the following link to authenticate:', url)
})