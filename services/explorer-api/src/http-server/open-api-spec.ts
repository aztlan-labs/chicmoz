export const genereateOpenApiSpec = (paths: unknown) => ({
  "openapi": "3.0.0",
  "info": {
    "title": "Chicmoz Explorer API",
    "version": "0.1.0",
    "description": "API for exploring Chicmoz blockchain data"
  },
  "servers": [
    {
      "url": "https://api.chicmoz.info/v1/{projectId}",
      "variables": {
        "projectId": {
          "default": "d1e2083a-660c-4314-a6f2-1d42f4b944f4",
          "description": "The project ID"
        }
      }
    }
  ],
  paths
});

//  "paths": {
//    "/l2/latest-height": {
//      "get": {
//        "summary": "Get the latest block height",
//        "responses": {
//          "200": {
//            "description": "Successful response",
//            "content": {
//              "application/json": {
//                "schema": {
//                  "type": "object",
//                  "properties": {
//                    "height": {
//                      "type": "integer"
//                    }
//                  }
//                }
//              }
//            }
//          }
//        }
//      }
//    },
//    "/l2/blocks/latest": {
//      "get": {
//        "summary": "Get the latest block",
//        "responses": {
//          "200": {
//            "description": "Successful response",
//            "content": {
//              "application/json": {
//                "schema": {
//                  "type": "object"
//                }
//              }
//            }
//          }
//        }
//      }
//    },
//    "/l2/blocks/{heightOrHash}": {
//      "get": {
//        "summary": "Get a block by height or hash",
//        "parameters": [
//          {
//            "name": "heightOrHash",
//            "in": "path",
//            "required": true,
//            "schema": {
//              "oneOf": [
//                {
//                  "type": "string",
//                  "pattern": "^0x[a-fA-F0-9]+$"
//                },
//                {
//                  "type": "integer"
//                }
//              ]
//            }
//          }
//        ],
//        "responses": {
//          "200": {
//            "description": "Successful response",
//            "content": {
//              "application/json": {
//                "schema": {
//                  "type": "object"
//                }
//              }
//            }
//          }
//        }
//      }
//    },
//    "/l2/blocks": {
//      "get": {
//        "summary": "Get multiple blocks",
//        "parameters": [
//          {
//            "name": "from",
//            "in": "query",
//            "schema": {
//              "type": "integer"
//            }
//          },
//          {
//            "name": "to",
//            "in": "query",
//            "schema": {
//              "type": "integer"
//            }
//          }
//        ],
//        "responses": {
//          "200": {
//            "description": "Successful response",
//            "content": {
//              "application/json": {
//                "schema": {
//                  "type": "array",
//                  "items": {
//                    "type": "object"
//                  }
//                }
//              }
//            }
//          }
//        }
//      }
//    },
//    "/l2/blocks/{blockHeight}/txEffects": {
//      "get": {
//        "summary": "Get transaction effects by block height",
//        "parameters": [
//          {
//            "name": "blockHeight",
//            "in": "path",
//            "required": true,
//            "schema": {
//              "type": "integer"
//            }
//          }
//        ],
//        "responses": {
//          "200": {
//            "description": "Successful response",
//            "content": {
//              "application/json": {
//                "schema": {
//                  "type": "array",
//                  "items": {
//                    "type": "object"
//                  }
//                }
//              }
//            }
//          }
//        }
//      }
//    },
//    "/l2/blocks/{blockHeight}/txEffects/{txEffectIndex}": {
//      "get": {
//        "summary": "Get a specific transaction effect by block height and index",
//        "parameters": [
//          {
//            "name": "blockHeight",
//            "in": "path",
//            "required": true,
//            "schema": {
//              "type": "integer"
//            }
//          },
//          {
//            "name": "txEffectIndex",
//            "in": "path",
//            "required": true,
//            "schema": {
//              "type": "integer"
//            }
//          }
//        ],
//        "responses": {
//          "200": {
//            "description": "Successful response",
//            "content": {
//              "application/json": {
//                "schema": {
//                  "type": "object"
//                }
//              }
//            }
//          }
//        }
//      }
//    },
//    "/l2/txEffects/{txHash}": {
//      "get": {
//        "summary": "Get transaction effects by transaction hash",
//        "parameters": [
//          {
//            "name": "txHash",
//            "in": "path",
//            "required": true,
//            "schema": {
//              "type": "string",
//              "pattern": "^0x[a-fA-F0-9]+$"
//            }
//          }
//        ],
//        "responses": {
//          "200": {
//            "description": "Successful response",
//            "content": {
//              "application/json": {
//                "schema": {
//                  "type": "array",
//                  "items": {
//                    "type": "object"
//                  }
//                }
//              }
//            }
//          }
//        }
//      }
//    }
//  }
//
