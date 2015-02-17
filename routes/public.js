var config = require('../config');
var fmt = require('util').format;
var _ = require("lodash");

var unathenticatedRouteConfig = {
  config: {
    auth: {
      mode: 'try'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    }
  }
};

var ajaxy = {
  plugins: {
    crumb: {
      source: 'payload',
      restful: true
    }
  }
};

var enterpriseConfig = {
  plugins: {
    blankie: require('../lib/csp').enterprise
  }
};

module.exports = [
  {
    path: '/favicon.ico',
    method: 'GET',
    handler: {
      file: '../static/misc/favicon.ico'
    }
  },{
    path: '/robots.txt',
    method: 'GET',
    handler: {
      file: '../static/misc/robots.txt'
    }
  },{
    path: '/google17836d108133913c.html',
    method: 'GET',
    handler: function (request, reply) {
      reply("google-site-verification: google17836d108133913c.html");
    }
  },{
    path: '/install.sh',
    method: 'GET',
    handler: {
      file: '../static/misc/install.sh'
    }
  },{
    path: '/opensearch.xml',
    method: 'GET',
    handler: {
      file: '../static/misc/opensearch.xml'
    }
  },{
    path: '/static/{path*}',
    method: 'GET',
    handler: {
      directory: {
        path: './static'
      }
    }
  },{
    path: "/",
    method: "GET",
    handler: require('../facets/company/show-homepage')
  },{
    path: "/private-npm",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect("/private-modules").code(301);
    }
  },{
    path: "/contact",
    method: "GET",
    handler: require('../facets/company/show-contact')
  },{
    path: "/send-contact",
    method: "POST",
    handler: require('../facets/company/show-send-contact')
  },{
    path: "/support",
    method: "GET",
    handler: require('../facets/company/show-contact')
  },{
    path: "/policies/{policy?}",
    method: "GET",
    handler: require('../facets/company/show-policy')
  },{
    path: "/whoshiring",
    method: "GET",
    handler: require('../facets/company/show-whoshiring')
  },{
    path: "/joinwhoshiring",
    method: "GET",
    handler: require('../facets/company/show-whoshiring-payments')
  },{
    path: "/joinwhoshiring",
    method: "POST",
    handler: require('../facets/company/show-whoshiring-payments'),
    config: ajaxy
  },{
    path: "/enterprise",
    method: "GET",
    handler: require('../facets/enterprise/show-index'),
    config: enterpriseConfig
  },{
    path: "/enterprise-start-signup",
    method: "POST",
    handler: require('../facets/enterprise/show-ula'),
    config: enterpriseConfig
  },{
    path: "/enterprise-contact-me",
    method: "POST",
    handler: require('../facets/enterprise/show-contact-me'),
    config: enterpriseConfig
  },{
    path: "/enterprise-trial-signup",
    method: "POST",
    handler: require('../facets/enterprise/show-trial-signup'),
    config: enterpriseConfig
  },{
    path: "/enterprise-verify",
    method: "GET",
    handler: require('../facets/enterprise/show-verification'),
    config: enterpriseConfig
  },{
    path: "/package/{package}/collaborators",
    method: "GET",
    handler: require('../handlers/collaborator').list
  },{
    path: "/package/{package}/collaborators",
    method: "PUT",
    handler: require('../handlers/collaborator').add
  },{
    path: "/package/{package}/collaborators/{username}",
    method: "POST",
    handler: require('../handlers/collaborator').update,
    config: ajaxy
  },{
    path: "/package/{package}/collaborators/{username}",
    method: "DELETE",
    handler: require('../handlers/collaborator').del
  },{
    paths: [
      "/package/{package}",
      "/package/{scope}/{package}",
    ],
    method: "GET",
    handler: require('../facets/registry/show-package')
  },{
    // redirect plural form to singular
    path: "/packages/{package}",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect("/package/" + request.params.package).code(301);
    }
  },{
    path: "/package/{package}/access",
    method: "GET",
    handler: require('../handlers/access')
  },{
    path: "/package/{scope}/{package}/access",
    method: "GET",
    handler: require('../handlers/access')
  },{
    // Redirect to home, because who cares
    path: "/browse/all",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect("/").code(301);
    }
  },{
    // Redirect to /~user#packages
    path: "/browse/author/{user}",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect(fmt("/~%s#packages", request.params.user)).code(301);
    }
  },{
    // Users, ordered descending by how many packages they've starred
    path: "/browse/userstar",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect("/").code(301);
    }
  },{
    // Redirect to /~user#starred
    path: "/browse/userstar/{user}",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect(fmt("/~%s#starred", request.params.user)).code(301);
    }
  },{
    // Catch-all for all other browse pages
    // - top keywords
    // - packages that have a certain keywords
    // - recently updated packages
    // - prolific authors
    // - most depended-upon packages
    // - all the packages that depend on the given package
    path: "/browse/{p*}",
    method: "GET",
    handler: require('../facets/registry/show-browse')
  },{
    path: "/keyword/{kw}",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect('/browse/keyword/' + request.params.kw).code(301);
    }
  },{
    path: "/recent-authors/{since?}",
    method: "GET",
    handler: require('../facets/registry/show-recent-authors')
  },{
    path: "/star",
    method: "POST",
    handler: require('../facets/registry/show-star'),
    config: ajaxy
  },{
    path: "/search/{q?}",
    method: "GET",
    handler: require('../facets/registry/show-search')(config.search)
  },{
    path: "/~{name}",
    method: "GET",
    handler: require('../facets/user/show-profile')
  },{
    path: "/profile/{name}",
    method: "GET",
    handler: require('../facets/user/show-profile')
  },{
    path: "/~/{name}",
    method: "GET",
    handler: require('../facets/user/show-profile')
  },{
    path: "/signup",
    method: "GET",
    handler: require('../facets/user/show-signup')
  },{
    path: "/signup",
    method: "HEAD",
    handler: require('../facets/user/show-signup')
  },{
    path: "/signup",
    method: "POST",
    handler: require('../facets/user/show-signup')
  },{
    path: "/confirm-email/{token?}",
    method: "GET",
    handler: require('../facets/user/show-confirm-email')
  },{
    path: "/login",
    method: "GET",
    handler: require('../facets/user/show-login')
  },{
    path: "/login",
    method: "POST",
    handler: require('../facets/user/show-login')
  },{
    path: "/logout",
    method: "GET",
    handler: require('../facets/user/show-logout')
  },{
    path: "/forgot/{token?}",
    method: "GET",
    handler: require('../facets/user/show-forgot')(config.user.mail)
  },{
    path: "/forgot/{token?}",
    method: "HEAD",
    handler: require('../facets/user/show-forgot')(config.user.mail)
  },{
    path: "/forgot/{token?}",
    method: "POST",
    handler: require('../facets/user/show-forgot')(config.user.mail)
  },{
    path: "/_monitor/ping",
    method: "GET",
    handler: function(request, reply) {
      return reply('ok').code(200);
    }
  },{
    path: "/_monitor/status",
    method: "GET",
    handler: require('../handlers/ops').status(require('../package.json').version)
  },{
    path: "/-/csplog",
    method: "POST",
    handler: require('../handlers/ops').csplog,
    config: {
      plugins: {
        crumb: false
      }
    }
  },{
    method: '*',
    path: '/doc/{p*}',
    handler: function(request, reply) {
      return reply.redirect(require("url").format({
        protocol: "https",
        hostname: "docs.npmjs.com",
        pathname: request.url.path
          .replace(/^\/doc/, "")
          .replace(/\.html$/, "")
          .replace(/\/npm-/, "/")
      })).code(301)
    }
  },{
    method: '*',
    path: '/{p*}',
    handler: require("../handlers/fallback")
  }

].map(function(route){
  return _.merge({}, unathenticatedRouteConfig, route)
})