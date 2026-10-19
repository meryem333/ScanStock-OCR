<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/audit-logs' => [[['_route' => 'app_audit_logs_list', '_controller' => 'App\\Controller\\AuditLogController::list'], null, ['GET' => 0], null, false, false, null]],
        '/api/reports' => [
            [['_route' => 'app_reports_list', '_controller' => 'App\\Controller\\ReportController::list'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'app_reports_generate', '_controller' => 'App\\Controller\\ReportController::generate'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/scans' => [
            [['_route' => 'app_scans_create', '_controller' => 'App\\Controller\\ScanController::create'], null, ['POST' => 0], null, false, false, null],
            [['_route' => 'app_scans_list', '_controller' => 'App\\Controller\\ScanController::list'], null, ['GET' => 0], null, false, false, null],
        ],
        '/api/login' => [[['_route' => 'api_login'], null, ['POST' => 0], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/api(?'
                    .'|/(?'
                        .'|docs(?:\\.([^/]++))?(*:37)'
                        .'|\\.well\\-known/genid/([^/]++)(*:72)'
                        .'|validation_errors/([^/]++)(*:105)'
                    .')'
                    .'|(?:/(index)(?:\\.([^/]++))?)?(*:142)'
                    .'|/(?'
                        .'|c(?'
                            .'|ontexts/([^.]+)(?:\\.(jsonld))?(*:188)'
                            .'|ategories(?'
                                .'|(?:\\.([^/]++))?(*:223)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(*:257)'
                                .'|(?:\\.([^/]++))?(*:280)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                    .'|(*:317)'
                                .')'
                            .')'
                            .'|lients(?'
                                .'|(?:\\.([^/]++))?(*:351)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(*:385)'
                                .'|(?:\\.([^/]++))?(*:408)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                    .'|(*:445)'
                                .')'
                            .')'
                        .')'
                        .'|errors/(\\d+)(?:\\.([^/]++))?(*:483)'
                        .'|validation_errors/([^/]++)(?'
                            .'|(*:520)'
                        .')'
                        .'|products(?'
                            .'|(?:\\.([^/]++))?(*:555)'
                            .'|/([^/\\.]++)(?:\\.([^/]++))?(*:589)'
                            .'|(?:\\.([^/]++))?(*:612)'
                            .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                .'|(*:649)'
                            .')'
                        .')'
                        .'|s(?'
                            .'|ettings(?'
                                .'|(?:\\.([^/]++))?(*:688)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(*:722)'
                                .'|(?:\\.([^/]++))?(*:745)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                    .'|(*:782)'
                                .')'
                            .')'
                            .'|tocks(?'
                                .'|(?:\\.([^/]++))?(*:815)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(*:849)'
                                .'|(?:\\.([^/]++))?(*:872)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                    .'|(*:909)'
                                .')'
                            .')'
                            .'|uppliers(?'
                                .'|(?:\\.([^/]++))?(*:945)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(*:979)'
                                .'|(?:\\.([^/]++))?(*:1002)'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                    .'|(*:1040)'
                                .')'
                            .')'
                            .'|cans/(?'
                                .'|(\\d+)/validate(*:1073)'
                                .'|(\\d+)(*:1087)'
                            .')'
                        .')'
                        .'|reports/(?'
                            .'|(\\d+)(*:1114)'
                            .'|(\\d+)/export(*:1135)'
                        .')'
                    .')'
                .')'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:1175)'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        37 => [[['_route' => 'api_doc', '_controller' => 'api_platform.action.documentation', '_format' => '', '_api_respond' => 'true'], ['_format'], ['GET' => 0, 'HEAD' => 1], null, false, true, null]],
        72 => [[['_route' => 'api_genid', '_controller' => 'api_platform.action.not_exposed', '_api_respond' => 'true'], ['id'], ['GET' => 0, 'HEAD' => 1], null, false, true, null]],
        105 => [[['_route' => 'api_validation_errors', '_controller' => 'api_platform.action.not_exposed'], ['id'], ['GET' => 0, 'HEAD' => 1], null, false, true, null]],
        142 => [[['_route' => 'api_entrypoint', '_controller' => 'api_platform.action.entrypoint', '_format' => '', '_api_respond' => 'true', 'index' => 'index'], ['index', '_format'], ['GET' => 0, 'HEAD' => 1], null, false, true, null]],
        188 => [[['_route' => 'api_jsonld_context', '_controller' => 'api_platform.jsonld.action.context', '_format' => 'jsonld', '_api_respond' => 'true'], ['shortName', '_format'], ['GET' => 0, 'HEAD' => 1], null, false, true, null]],
        223 => [[['_route' => '_api_/categories{._format}_get_collection', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Category', '_api_operation_name' => '_api_/categories{._format}_get_collection', '_format' => null], ['_format'], ['GET' => 0], null, false, true, null]],
        257 => [[['_route' => '_api_/categories/{id}{._format}_get', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Category', '_api_operation_name' => '_api_/categories/{id}{._format}_get', '_format' => null], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        280 => [[['_route' => '_api_/categories{._format}_post', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Category', '_api_operation_name' => '_api_/categories{._format}_post', '_format' => null], ['_format'], ['POST' => 0], null, false, true, null]],
        317 => [
            [['_route' => '_api_/categories/{id}{._format}_patch', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Category', '_api_operation_name' => '_api_/categories/{id}{._format}_patch', '_format' => null], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/categories/{id}{._format}_delete', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Category', '_api_operation_name' => '_api_/categories/{id}{._format}_delete', '_format' => null], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        351 => [[['_route' => '_api_/clients{._format}_get_collection', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Client', '_api_operation_name' => '_api_/clients{._format}_get_collection', '_format' => null], ['_format'], ['GET' => 0], null, false, true, null]],
        385 => [[['_route' => '_api_/clients/{id}{._format}_get', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Client', '_api_operation_name' => '_api_/clients/{id}{._format}_get', '_format' => null], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        408 => [[['_route' => '_api_/clients{._format}_post', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Client', '_api_operation_name' => '_api_/clients{._format}_post', '_format' => null], ['_format'], ['POST' => 0], null, false, true, null]],
        445 => [
            [['_route' => '_api_/clients/{id}{._format}_patch', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Client', '_api_operation_name' => '_api_/clients/{id}{._format}_patch', '_format' => null], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/clients/{id}{._format}_delete', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Client', '_api_operation_name' => '_api_/clients/{id}{._format}_delete', '_format' => null], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        483 => [[['_route' => '_api_errors', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => null, '_api_resource_class' => 'ApiPlatform\\State\\ApiResource\\Error', '_api_operation_name' => '_api_errors', '_format' => null], ['status', '_format'], ['GET' => 0], null, false, true, null]],
        520 => [
            [['_route' => '_api_validation_errors_problem', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => null, '_api_resource_class' => 'ApiPlatform\\Validator\\Exception\\ValidationException', '_api_operation_name' => '_api_validation_errors_problem', '_format' => null], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_validation_errors_hydra', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => null, '_api_resource_class' => 'ApiPlatform\\Validator\\Exception\\ValidationException', '_api_operation_name' => '_api_validation_errors_hydra', '_format' => null], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_validation_errors_jsonapi', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => null, '_api_resource_class' => 'ApiPlatform\\Validator\\Exception\\ValidationException', '_api_operation_name' => '_api_validation_errors_jsonapi', '_format' => null], ['id'], ['GET' => 0], null, false, true, null],
        ],
        555 => [[['_route' => '_api_/products{._format}_get_collection', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Product', '_api_operation_name' => '_api_/products{._format}_get_collection', '_format' => null], ['_format'], ['GET' => 0], null, false, true, null]],
        589 => [[['_route' => '_api_/products/{id}{._format}_get', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Product', '_api_operation_name' => '_api_/products/{id}{._format}_get', '_format' => null], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        612 => [[['_route' => '_api_/products{._format}_post', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Product', '_api_operation_name' => '_api_/products{._format}_post', '_format' => null], ['_format'], ['POST' => 0], null, false, true, null]],
        649 => [
            [['_route' => '_api_/products/{id}{._format}_patch', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Product', '_api_operation_name' => '_api_/products/{id}{._format}_patch', '_format' => null], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/products/{id}{._format}_delete', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Product', '_api_operation_name' => '_api_/products/{id}{._format}_delete', '_format' => null], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        688 => [[['_route' => '_api_/settings{._format}_get_collection', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Setting', '_api_operation_name' => '_api_/settings{._format}_get_collection', '_format' => null], ['_format'], ['GET' => 0], null, false, true, null]],
        722 => [[['_route' => '_api_/settings/{id}{._format}_get', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Setting', '_api_operation_name' => '_api_/settings/{id}{._format}_get', '_format' => null], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        745 => [[['_route' => '_api_/settings{._format}_post', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Setting', '_api_operation_name' => '_api_/settings{._format}_post', '_format' => null], ['_format'], ['POST' => 0], null, false, true, null]],
        782 => [
            [['_route' => '_api_/settings/{id}{._format}_patch', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Setting', '_api_operation_name' => '_api_/settings/{id}{._format}_patch', '_format' => null], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/settings/{id}{._format}_delete', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Setting', '_api_operation_name' => '_api_/settings/{id}{._format}_delete', '_format' => null], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        815 => [[['_route' => '_api_/stocks{._format}_get_collection', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Stock', '_api_operation_name' => '_api_/stocks{._format}_get_collection', '_format' => null], ['_format'], ['GET' => 0], null, false, true, null]],
        849 => [[['_route' => '_api_/stocks/{id}{._format}_get', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Stock', '_api_operation_name' => '_api_/stocks/{id}{._format}_get', '_format' => null], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        872 => [[['_route' => '_api_/stocks{._format}_post', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Stock', '_api_operation_name' => '_api_/stocks{._format}_post', '_format' => null], ['_format'], ['POST' => 0], null, false, true, null]],
        909 => [
            [['_route' => '_api_/stocks/{id}{._format}_patch', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Stock', '_api_operation_name' => '_api_/stocks/{id}{._format}_patch', '_format' => null], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/stocks/{id}{._format}_delete', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Stock', '_api_operation_name' => '_api_/stocks/{id}{._format}_delete', '_format' => null], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        945 => [[['_route' => '_api_/suppliers{._format}_get_collection', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Supplier', '_api_operation_name' => '_api_/suppliers{._format}_get_collection', '_format' => null], ['_format'], ['GET' => 0], null, false, true, null]],
        979 => [[['_route' => '_api_/suppliers/{id}{._format}_get', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Supplier', '_api_operation_name' => '_api_/suppliers/{id}{._format}_get', '_format' => null], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        1002 => [[['_route' => '_api_/suppliers{._format}_post', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Supplier', '_api_operation_name' => '_api_/suppliers{._format}_post', '_format' => null], ['_format'], ['POST' => 0], null, false, true, null]],
        1040 => [
            [['_route' => '_api_/suppliers/{id}{._format}_patch', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Supplier', '_api_operation_name' => '_api_/suppliers/{id}{._format}_patch', '_format' => null], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/suppliers/{id}{._format}_delete', '_controller' => 'api_platform.symfony.main_controller', '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Supplier', '_api_operation_name' => '_api_/suppliers/{id}{._format}_delete', '_format' => null], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        1073 => [[['_route' => 'app_scans_validate', '_controller' => 'App\\Controller\\ScanController::validate'], ['id'], ['PUT' => 0], null, false, false, null]],
        1087 => [[['_route' => 'app_scans_show', '_controller' => 'App\\Controller\\ScanController::show'], ['id'], ['GET' => 0], null, false, true, null]],
        1114 => [[['_route' => 'app_reports_show', '_controller' => 'App\\Controller\\ReportController::show'], ['id'], ['GET' => 0], null, false, true, null]],
        1135 => [[['_route' => 'app_reports_export', '_controller' => 'App\\Controller\\ReportController::export'], ['id'], ['GET' => 0], null, false, false, null]],
        1175 => [
            [['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
