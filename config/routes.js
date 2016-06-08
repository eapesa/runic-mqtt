/**
 * Route Mappings
 * (sails.config.routes)
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  'get /'     : 'web/PageController.main',
  'get /main' : 'web/PageController.main',
  // 'get /main' : 'web/PageController.'

  'get /v1/users'     : 'api/v1/UsersController.get',
  'post /v1/users'    : 'api/v1/UsersController.add',
  'delete /v1/users'  : 'api/v1/UsersController.delete'
};
