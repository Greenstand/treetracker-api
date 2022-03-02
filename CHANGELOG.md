# [1.13.0](https://github.com/Greenstand/treetracker-api/compare/v1.12.6...v1.13.0) (2022-03-02)


### Features

* remove legacy ground_user API endpoint ([a1f74f8](https://github.com/Greenstand/treetracker-api/commit/a1f74f8021553a58bf15955df0c9976310f41d0d))

## [1.12.6](https://github.com/Greenstand/treetracker-api/compare/v1.12.5...v1.12.6) (2022-03-02)


### Bug Fixes

* use loglevel ([38513a9](https://github.com/Greenstand/treetracker-api/commit/38513a9c1e1a9cb292e580744f5b3f5512bfb510))

## [1.12.5](https://github.com/Greenstand/treetracker-api/compare/v1.12.4...v1.12.5) (2022-03-01)


### Bug Fixes

* incorrect name for rabbit mq secret in deployment file ([5c3ec5a](https://github.com/Greenstand/treetracker-api/commit/5c3ec5af48ec48988f7def72e3b6870d04b1f656))

## [1.12.4](https://github.com/Greenstand/treetracker-api/compare/v1.12.3...v1.12.4) (2022-03-01)


### Bug Fixes

* force deployment ([93c8cd6](https://github.com/Greenstand/treetracker-api/commit/93c8cd66e3499ae06bd1b982801484e652677a60))

## [1.12.3](https://github.com/Greenstand/treetracker-api/compare/v1.12.2...v1.12.3) (2022-03-01)


### Bug Fixes

* set up rabbitmq credentials ([c8fb50c](https://github.com/Greenstand/treetracker-api/commit/c8fb50cc44ba78c4bd68c61814af14eb62b8717a))

## [1.12.2](https://github.com/Greenstand/treetracker-api/compare/v1.12.1...v1.12.2) (2022-02-27)


### Bug Fixes

* remove email string validation on email - mobile entry can be used in other ways ([7ebbc4e](https://github.com/Greenstand/treetracker-api/commit/7ebbc4eea080a000cee1dbc2049870d20a9de93b))

## [1.12.1](https://github.com/Greenstand/treetracker-api/compare/v1.12.0...v1.12.1) (2022-02-24)


### Bug Fixes

* add location, lat and lon to payload for /grower_accounts ([71e1090](https://github.com/Greenstand/treetracker-api/commit/71e1090576d6450e0e1c41f1eaee0e3a334da2ad))

# [1.12.0](https://github.com/Greenstand/treetracker-api/compare/v1.11.6...v1.12.0) (2022-02-18)


### Bug Fixes

* capture filterCriteria object to handle null/notnull ([ab72e76](https://github.com/Greenstand/treetracker-api/commit/ab72e76a07526db28d34e91ca2441570df685ca2))
* linting ([1a4cd45](https://github.com/Greenstand/treetracker-api/commit/1a4cd450d23f096ed3765f8ca9e7cde44b071f6a))
* update code to match new migrations ([000807e](https://github.com/Greenstand/treetracker-api/commit/000807e4aa7c03a7de115c42975e1a9e7a0c1223))
* update grower-account endpoints ([5fe687b](https://github.com/Greenstand/treetracker-api/commit/5fe687b5f1acc92b2e487158be167390c59aca57))


### Features

* add /grower_accounts/put endpoint ([5c6ae70](https://github.com/Greenstand/treetracker-api/commit/5c6ae70a4148010f4618ebeab84486a3136a066e))
* add date range and organization id filters ([0cc008e](https://github.com/Greenstand/treetracker-api/commit/0cc008e8f554eaf433cb327839b33275f978aaa7))
* add order by query parameters for /captures ([12ef65c](https://github.com/Greenstand/treetracker-api/commit/12ef65c60912278195779e12ba02ccdacdd2ba6b))
* add organization_ids array query parameter for /captures ([d8a04ea](https://github.com/Greenstand/treetracker-api/commit/d8a04ead92959e6bbca41e20e06ede5fa6b9c4f8))

## [1.11.6](https://github.com/Greenstand/treetracker-api/compare/v1.11.5...v1.11.6) (2022-02-09)


### Bug Fixes

* allow for null values, populate and add constraint ([5bdfcde](https://github.com/Greenstand/treetracker-api/commit/5bdfcdeaf531e5aaaa053713cc60d567e360c6bc))
* fix lint errors related to db-migrate files ([6f8e0f5](https://github.com/Greenstand/treetracker-api/commit/6f8e0f5df763dd020b300767c0518907f9370cc5))
* replace var with let in db-migrate js files ([41df75d](https://github.com/Greenstand/treetracker-api/commit/41df75de92ef8a0ee523a0cd176f320f12b75364))
* update mock data to reflect changed/dropped attributes ([8ac36d7](https://github.com/Greenstand/treetracker-api/commit/8ac36d74333c4581aa5d24145f33771faf39e101))

## [1.11.5](https://github.com/Greenstand/treetracker-api/compare/v1.11.4...v1.11.5) (2022-02-04)


### Bug Fixes

* update database migration sealed secret ([407cc93](https://github.com/Greenstand/treetracker-api/commit/407cc93d782bb7c0da18ced3dee8f14aee0e5d2c))

## [1.11.4](https://github.com/Greenstand/treetracker-api/compare/v1.11.3...v1.11.4) (2022-02-04)


### Bug Fixes

* use geographic location for potential matches ([4ba3d70](https://github.com/Greenstand/treetracker-api/commit/4ba3d707ba930d442d72af5ab9a27fd8104e225d))

## [1.11.3](https://github.com/Greenstand/treetracker-api/compare/v1.11.2...v1.11.3) (2022-02-04)


### Bug Fixes

* remove timeout for service ([fb70d04](https://github.com/Greenstand/treetracker-api/commit/fb70d04d1df253c7e55778e9282472fe2119cce4))

## [1.11.2](https://github.com/Greenstand/treetracker-api/compare/v1.11.1...v1.11.2) (2022-02-04)


### Bug Fixes

* return count with tree_associated filter applied ([865fb74](https://github.com/Greenstand/treetracker-api/commit/865fb74bf3a6b14854f49e0e11404ccef372dcaa))

## [1.11.1](https://github.com/Greenstand/treetracker-api/compare/v1.11.0...v1.11.1) (2022-02-03)


### Bug Fixes

* add Authorization header to CORS ([c154c84](https://github.com/Greenstand/treetracker-api/commit/c154c84be92c37efe8c11416c3c02c7d54e2e579))

# [1.11.0](https://github.com/Greenstand/treetracker-api/compare/v1.10.0...v1.11.0) (2022-02-03)


### Bug Fixes

* fix integration tests ([f8008a6](https://github.com/Greenstand/treetracker-api/commit/f8008a6f55cc19c7358f81b3fb7e68db0ed564eb))
* fix linter error ([dfe65d4](https://github.com/Greenstand/treetracker-api/commit/dfe65d474167a6887d27b02808381683b9aba0ca))
* integration test fix ([7d3de21](https://github.com/Greenstand/treetracker-api/commit/7d3de218ff18f5fb62ac1c9a646cf76300735fc8))
* lint ([6b6f855](https://github.com/Greenstand/treetracker-api/commit/6b6f855fd8b11b9b1b3c86b6af84b0580b23a8f5))


### Features

* implement tree_associated query param on capture, update integration tests, some cleanup ([412abfb](https://github.com/Greenstand/treetracker-api/commit/412abfbb096293d31ff99c885f1bca8db72bbbbe))
* limit capture-match request to one capture at a time and fix PATCH handler validation ([cd2b044](https://github.com/Greenstand/treetracker-api/commit/cd2b0449b607310db81e8ed1486e63065b8ace87))

# [1.10.0](https://github.com/Greenstand/treetracker-api/compare/v1.9.5...v1.10.0) (2022-02-02)


### Bug Fixes

* integration test fix ([f1e24f9](https://github.com/Greenstand/treetracker-api/commit/f1e24f979affe3927ac5d3b6c299735050398a45))
* lint ([811472c](https://github.com/Greenstand/treetracker-api/commit/811472c901433b96a9d91c74dca0746f467a1fc6))


### Features

* implement tree_associated query param on capture, update integration tests, some cleanup ([5beb6be](https://github.com/Greenstand/treetracker-api/commit/5beb6bede41292ba00b748684984165487715093))

## [1.9.5](https://github.com/Greenstand/treetracker-api/compare/v1.9.4...v1.9.5) (2022-01-27)


### Bug Fixes

* add overal for production deployment ([0f46254](https://github.com/Greenstand/treetracker-api/commit/0f46254c50d27b7531e6cae8d38fc6cec4dcc3dc))

## [1.9.4](https://github.com/Greenstand/treetracker-api/compare/v1.9.3...v1.9.4) (2022-01-26)


### Bug Fixes

* force release ([b06f1f6](https://github.com/Greenstand/treetracker-api/commit/b06f1f6167820fa4c2414b78559b06361a672587))

## [1.9.3](https://github.com/Greenstand/treetracker-api/compare/v1.9.2...v1.9.3) (2022-01-26)


### Bug Fixes

* seal secrets with correct namespace ([bd85a1a](https://github.com/Greenstand/treetracker-api/commit/bd85a1a42f84cb1f43dfbe13be2f8a49af342de6))

## [1.9.2](https://github.com/Greenstand/treetracker-api/compare/v1.9.1...v1.9.2) (2022-01-26)


### Bug Fixes

* change to filter by deleted ([f8e8132](https://github.com/Greenstand/treetracker-api/commit/f8e81323d61608df7006d686c09ca6667830a0bd))
* modify package.json so that any test failure fails the test script ([512b1e6](https://github.com/Greenstand/treetracker-api/commit/512b1e64f3478d27ca32449270eb76607b058949))
* modify package.json so that any test failure fails the test script ([1fad477](https://github.com/Greenstand/treetracker-api/commit/1fad4770a79a455fef41716c65882868befaf7ad))
* object was not closed ([97ce16b](https://github.com/Greenstand/treetracker-api/commit/97ce16b02bc7a1a3b1b04588207cb54d07fa72e4))
* update sealed secrets for test env ([8130e41](https://github.com/Greenstand/treetracker-api/commit/8130e41bfc98cbf208d58ff59a082ab4adf6c88e))

## [1.9.1](https://github.com/Greenstand/treetracker-api/compare/v1.9.0...v1.9.1) (2022-01-20)


### Bug Fixes

* use geography not geometry for distances in meters ([6058061](https://github.com/Greenstand/treetracker-api/commit/6058061a12c532afadc7f665e1e7eb5a4c2a3a83))

# [1.9.0](https://github.com/Greenstand/treetracker-api/compare/v1.8.2...v1.9.0) (2022-01-20)


### Bug Fixes

* add get grower account by id ([527b369](https://github.com/Greenstand/treetracker-api/commit/527b36930b2da508669b4c4139061b1d721e0195))
* change public property of tag to isPublic ([5d56719](https://github.com/Greenstand/treetracker-api/commit/5d567194be31b5c4045a73a1706e2b55fc30029d))
* rabbitmq integration ([41a83c3](https://github.com/Greenstand/treetracker-api/commit/41a83c32a7830ffb37f42689f63b9f2b00f390ed))
* refactor planter routes to groundUser ([958e8f7](https://github.com/Greenstand/treetracker-api/commit/958e8f7c98ef3419e5645c828f6474ca94906e96))
* refactor planter routes to groundUser ([381eadb](https://github.com/Greenstand/treetracker-api/commit/381eadb8682b1178fb7d9e83dad7de095ea834ff))
* soft delete implementation ([b3c378f](https://github.com/Greenstand/treetracker-api/commit/b3c378fd42835cf949c9b0d82808ebee9d6981cc))


### Features

* add grower_accounts endpoints ([8723ded](https://github.com/Greenstand/treetracker-api/commit/8723ded4da1e34ff03c2483e2dd226116acef02e))
* add id to /grower_accounts post request payload ([29d08b1](https://github.com/Greenstand/treetracker-api/commit/29d08b15b60d6f08a51173edc4aa5ec971850811))
* add tag name unique constraint ([431469f](https://github.com/Greenstand/treetracker-api/commit/431469f2c7bac761503fb3704518e5ac46c572d9))
* add updated tree/tag routes ([6bc8379](https://github.com/Greenstand/treetracker-api/commit/6bc83791da9a3576b2cbbb586bb7652bfbe6f84c))
* database schema updates and capture/tag routes updates ([3193c79](https://github.com/Greenstand/treetracker-api/commit/3193c79d1fa9458a153c99c724cd0478fb1c01d2))

## [1.8.2](https://github.com/Greenstand/treetracker-api/compare/v1.8.1...v1.8.2) (2021-12-28)


### Bug Fixes

* upgrade dockerfile to use node 16 ([38b7acb](https://github.com/Greenstand/treetracker-api/commit/38b7acb7bfcbb292cbb7eb6ee0107a083691c63a))

## [1.8.1](https://github.com/Greenstand/treetracker-api/compare/v1.8.0...v1.8.1) (2021-12-18)


### Bug Fixes

* open cors for dev in the correct place ([fa7be4c](https://github.com/Greenstand/treetracker-api/commit/fa7be4cc93aa6a49223d3b79a9dbc83950354fa3))

# [1.8.0](https://github.com/Greenstand/treetracker-api/compare/v1.7.5...v1.8.0) (2021-12-07)


### Bug Fixes

* add missing modules back in ([bac228a](https://github.com/Greenstand/treetracker-api/commit/bac228afdf0bce8e7b6f822ede5e615802054082))
* add Tree missing variable and cors to package.json ([e1926f7](https://github.com/Greenstand/treetracker-api/commit/e1926f784281c7f482e490eb5e6ec3406cb501c0))
* fix initial table create scripts to add default values ([a5e925b](https://github.com/Greenstand/treetracker-api/commit/a5e925b6313027ec92141f59db25692275c7c506))


### Features

* add /planters route ([068dafc](https://github.com/Greenstand/treetracker-api/commit/068dafcf68c87b82a18b944db52a017bf4b0b58d))
* add planter route ([41ab16e](https://github.com/Greenstand/treetracker-api/commit/41ab16ec38d05bfbe09f6e3c31ca1d8578b140fa))

## [1.7.5](https://github.com/Greenstand/treetracker-api/compare/v1.7.4...v1.7.5) (2021-12-02)


### Bug Fixes

* update sealed secret and replicas for dev ([349419a](https://github.com/Greenstand/treetracker-api/commit/349419aa8b89b0e62e5e0efa0a3a5de7eb8c70fa))

## [1.7.4](https://github.com/Greenstand/treetracker-api/compare/v1.7.3...v1.7.4) (2021-12-02)


### Bug Fixes

* broken tests ([a158e6a](https://github.com/Greenstand/treetracker-api/commit/a158e6a95a2752ca2a8548e25ba01188a8ea7c21))
* update call to run tests ([29cb6e4](https://github.com/Greenstand/treetracker-api/commit/29cb6e4339d5ce97fb1649e4927ebc73fbd5f14a))
* update docker hub image for postgix ([164d51e](https://github.com/Greenstand/treetracker-api/commit/164d51e4d7cd3b365a525bd5a688efdb238a37db))

## [1.7.3](https://github.com/Greenstand/treetracker-api/compare/v1.7.2...v1.7.3) (2021-11-25)


### Bug Fixes

* add database secrets for test env ([71f9acb](https://github.com/Greenstand/treetracker-api/commit/71f9acb5e13ea2cb286d7aa39eb66b7a95a0e25b))
* update sealed secrets ([81268f0](https://github.com/Greenstand/treetracker-api/commit/81268f0841e139bc95d6e38948e43902c2e8a9ab))

## [1.7.2](https://github.com/Greenstand/treetracker-api/compare/v1.7.1...v1.7.2) (2021-11-25)


### Bug Fixes

* restore k8s resources for db migration automation ([e20a599](https://github.com/Greenstand/treetracker-api/commit/e20a59937dbf72b38624c75db8f817f108bf4d83))

## [1.7.1](https://github.com/Greenstand/treetracker-api/compare/v1.7.0...v1.7.1) (2021-11-25)


### Bug Fixes

* enable database migrations via CD ([66f128b](https://github.com/Greenstand/treetracker-api/commit/66f128b3b04358e1db132bc56a7db882158793f0))

# [1.7.0](https://github.com/Greenstand/treetracker-api/compare/v1.6.4...v1.7.0) (2021-11-11)


### Features

* support for db-migrate automation not ready yet after all ([5f353e4](https://github.com/Greenstand/treetracker-api/commit/5f353e497e3af309ce468c351572a7f0ba0ae50c))

## [1.6.4](https://github.com/Greenstand/treetracker-api/compare/v1.6.3...v1.6.4) (2021-11-05)


### Bug Fixes

* update sealed secrets ([377ac06](https://github.com/Greenstand/treetracker-api/commit/377ac06c3331a7d5df38ea4ddd50e69e33d595fe))
* update sealed secrets ([eac05d0](https://github.com/Greenstand/treetracker-api/commit/eac05d054e1a01332246722bc7559988f81a81cf))

## [1.6.3](https://github.com/Greenstand/treetracker-api/compare/v1.6.2...v1.6.3) (2021-11-05)


### Bug Fixes

* sealed secret was missing password ([0d4e1c4](https://github.com/Greenstand/treetracker-api/commit/0d4e1c4e4eb75291ce1ff2ce7fc84ff07f88fcb0))

## [1.6.2](https://github.com/Greenstand/treetracker-api/compare/v1.6.1...v1.6.2) (2021-11-05)


### Bug Fixes

* add database migration connection sealed secret to overlay ([071151d](https://github.com/Greenstand/treetracker-api/commit/071151d80db7e8937e0a5525394f3a8b744ceaec))
* add database migration sealed secret to base ([411951a](https://github.com/Greenstand/treetracker-api/commit/411951a0e0b79b08a1605f28ce1ea7879cae6607))
* update api version of cluster role specs ([2c51e42](https://github.com/Greenstand/treetracker-api/commit/2c51e421f9a0117d0558b1bffc482d311990c75b))

## [1.6.1](https://github.com/Greenstand/treetracker-api/compare/v1.6.0...v1.6.1) (2021-11-05)


### Bug Fixes

* add missing database migration secret ([6cec49b](https://github.com/Greenstand/treetracker-api/commit/6cec49bd4c7097e74cab2744ec5abb35ac85d7ca))

# [1.6.0](https://github.com/Greenstand/treetracker-api/compare/v1.5.0...v1.6.0) (2021-11-05)


### Bug Fixes

* remove extra space, use 16.x image ([dd0384e](https://github.com/Greenstand/treetracker-api/commit/dd0384eb55ce10350e9ba47a09b55900f107a0d5))
* update database secret ([a444a6d](https://github.com/Greenstand/treetracker-api/commit/a444a6d2188132b435d7182e68fda4509549376e))


### Features

* add configurations for running db-migrate in deployment workflow ([e664606](https://github.com/Greenstand/treetracker-api/commit/e6646066923902595984f65c9be4e32bf6e8b097))
* add database migration deployment manifesets ([b5dce70](https://github.com/Greenstand/treetracker-api/commit/b5dce70a811376eab5f214b439ec16b723abac51))

# [1.5.0](https://github.com/Greenstand/treetracker-api/compare/v1.4.2...v1.5.0) (2021-10-29)


### Bug Fixes

* dont include schema in migrations ([f396e2f](https://github.com/Greenstand/treetracker-api/commit/f396e2f08335fa39b21564b8815d38ed6e7fecc8))
* duplicated variable ([e108e5e](https://github.com/Greenstand/treetracker-api/commit/e108e5ef11d3de36ec59c50bce56c3bc81412765))
* lint and prettier fix ([3cc7a39](https://github.com/Greenstand/treetracker-api/commit/3cc7a39c5556180e1203fd23afb148bae1e5e0d7))
* lint:fix ([3fd75ef](https://github.com/Greenstand/treetracker-api/commit/3fd75ef88f38b8ebabf584dac04d3f6a58ea4f96))
* more lint ([d372711](https://github.com/Greenstand/treetracker-api/commit/d372711842224b08ff6fab373539ea1ada9f4821))
* separate migrations ([1dc786a](https://github.com/Greenstand/treetracker-api/commit/1dc786a95d43d02a887f5a21c0b05452ceb0db3f))


### Features

* add estimated_geographic_location column ([7eec3d5](https://github.com/Greenstand/treetracker-api/commit/7eec3d56cba030c1d64945f161709602ed1a4df0))

## [1.4.2](https://github.com/Greenstand/treetracker-api/compare/v1.4.1...v1.4.2) (2021-10-20)


### Bug Fixes

* switch to ssl=no-verify ([e9c3405](https://github.com/Greenstand/treetracker-api/commit/e9c340561ef6159ab4b2140690901990d607bc02))

## [1.4.1](https://github.com/Greenstand/treetracker-api/compare/v1.4.0...v1.4.1) (2021-10-20)


### Bug Fixes

* added eslint configs ([24bec8a](https://github.com/Greenstand/treetracker-api/commit/24bec8a6045f0c25579af0ef8c2de01629827bcf))
* baserepository.spec.js issue ([706b881](https://github.com/Greenstand/treetracker-api/commit/706b8813a0f39c3eb8982f520953f7dbc9623a8a))
* configure database schema name ([1b943e5](https://github.com/Greenstand/treetracker-api/commit/1b943e5e773ff7f04286532eed4288a88b11e0ca))
* convert to updated deployment structure ([85c5f74](https://github.com/Greenstand/treetracker-api/commit/85c5f749480dd8c556dd1c30901b17a75fa941cd))
* fix name of base ([ad5c344](https://github.com/Greenstand/treetracker-api/commit/ad5c3443ea70c601e63d202b1ce2529ef2c4678f))
* fix name of database connection resource in deployment ([e050ca8](https://github.com/Greenstand/treetracker-api/commit/e050ca81cb0a4e796fd7029f8cf7d69ba63bdfaa))
* linting issues ([3b11f63](https://github.com/Greenstand/treetracker-api/commit/3b11f6382a7423f98575bda90a180909dafc0d53))
* release from main branch ([6b2156d](https://github.com/Greenstand/treetracker-api/commit/6b2156d4cb0ef6edd69bbb6fde7ff40b2cb2aab4))
* update package.json to node 16, add missing eslint package ([27189a6](https://github.com/Greenstand/treetracker-api/commit/27189a6501a597048086346425d72879b1728987))

# [1.4.0](https://github.com/Greenstand/treetracker-api/compare/v1.3.0...v1.4.0) (2021-05-11)


### Bug Fixes

* add patch request validation ([5818c94](https://github.com/Greenstand/treetracker-api/commit/5818c94f3e1c4284caec84028d7ed7427b8292ce))
* error handling ([e15fee3](https://github.com/Greenstand/treetracker-api/commit/e15fee3c1643b754821ee3de36156f851c20f312))


### Features

* patch endpoint for resource capture ([c1e3e22](https://github.com/Greenstand/treetracker-api/commit/c1e3e226fe70e1d4aa6b37131eea659cd0fb07db))

# [1.3.0](https://github.com/Greenstand/treetracker-api/compare/v1.2.0...v1.3.0) (2021-04-11)


### Features

* api endpoints w/ connection to database ([403fb7c](https://github.com/Greenstand/treetracker-api/commit/403fb7c1251badc889f2a0052ccdd39405021fe3))

# [1.2.0](https://github.com/Greenstand/treetracker-api/compare/v1.1.2...v1.2.0) (2021-02-24)


### Features

* add backing schema/tables for treetracker-api ([c78c9c4](https://github.com/Greenstand/treetracker-api/commit/c78c9c46b581b14a12d07ca6111b9a006fe50706))

## [1.1.2](https://github.com/Greenstand/treetracker-api/compare/v1.1.1...v1.1.2) (2021-02-24)


### Bug Fixes

* added example env ([1b25dec](https://github.com/Greenstand/treetracker-api/commit/1b25decf4ce9dc3424f134fdfbbe7a0092c3c7ef))
* remove incorrect expect ([48e86a9](https://github.com/Greenstand/treetracker-api/commit/48e86a9fc02d1d9e974d9a40db61b4d7508501d6))

## [1.1.1](https://github.com/Greenstand/treetracker-api/compare/v1.1.0...v1.1.1) (2021-02-07)


### Bug Fixes

* add cors allow to deployment ([9b7b7fc](https://github.com/Greenstand/treetracker-api/commit/9b7b7fc52f65aa7b2125543c954a3b3abd7be550))

# [1.1.0](https://github.com/Greenstand/treetracker-api/compare/v1.0.1...v1.1.0) (2021-02-05)


### Features

* increased data set size and randomized.  add in uuid ([c3da184](https://github.com/Greenstand/treetracker-api/commit/c3da1845fdd12951af019718f899a1530837cfb3))

## [1.0.1](https://github.com/Greenstand/treetracker-api/compare/v1.0.0...v1.0.1) (2021-02-05)


### Bug Fixes

* correct the api mount point ([5327fbc](https://github.com/Greenstand/treetracker-api/commit/5327fbce9bb7d5753e76c95dc399ef3bcfcbc2aa))

# 1.0.0 (2021-02-05)


### Features

* implement a mock treetracker service api ([ab4474c](https://github.com/Greenstand/treetracker-api/commit/ab4474cbe44ea3957abac709fbc803da09797827))
