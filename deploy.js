// deploy.js
const ghpages = require('gh-pages')

ghpages.publish('dist', { dotfiles: true }, function (err) {
    if (err) {
        console.error('❌ Deployment failed:', err)
    } else {
        console.log('✅ Deployment successful! Your site is live 🎉')
    }
})