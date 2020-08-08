export const swaggerDocument = {
    "swagger": "2.0",
    "info": {
      "description": "Documentação para API de My Bank",
      "version": "1.0.0",
      "title": "IGTI MyBank"
    },
    "host": "localhost:2700",
    "tags": [
      {
        "name": "account",
        "description": "Account Management"
      }
    ],
    "paths": {
      "/account": {
        "get": {
          "tags": [
            "account"
          ],
          "summary": "Get existing accounts",
          "description": "Get existing account description",
          "produces": [
            "application/json"
          ],
          "responses": {
            "200": {
              "description": "successful operation",
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/Account"
                }
              }
            },
            "400": {
              "description": "Error occurred"
            }
          }
        },
        "post": {
          "tags": [
            "account"
          ],
          "summary": "Create a new account",
          "description": "Create a new account with the received parameters",
          "consumes": [
            "application/json"
          ],
          "parameters": [
            {
              "in": "body",
              "name": "body",
              "description": "Account object",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Account"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Account created"
            },
            "400": {
              "description": "Error occurred"
            }
          }
        }
      }
    },
    "definitions": {
      "Account": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "Alexandre Pinheiro"
          },
          "balance": {
            "type": "number",
            "example": 23323.32
          }
        }
      }
    }
  };
