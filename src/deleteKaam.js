"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const deleteKaam = async (event) => {
  try {
    // URL se ID nikalne ke liye (e.g., /delete/{id})
    const { id } = event.pathParameters;

    await dynamoDb.send(new DeleteCommand({
      TableName: "KaamKaro",
      Key: {
        id: id, // DynamoDB mein jo Primary Key hai uska naam yahan likhein
      },
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Kaam delete ho gaya!", id }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Delete karne mein masla hua", error: err.message }),
    };
  }
};

module.exports = {
  handler: deleteKaam,
};
