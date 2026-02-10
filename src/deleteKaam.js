"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const deleteKaam = async (event) => {
  try {
    // API Gateway se ID nikalna
    const id = event.pathParameters.id; 

    await dynamoDb.send(new DeleteCommand({
      TableName: "KaamKaro",
      Key: {
        id: id // Check karein ke aapki table ki Primary Key ka naam 'id' hi hai
      },
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Kaam kamyabi se delete ho gaya!", id }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Delete nahi ho saka", error: err.message }),
    };
  }
};

module.exports = {
  handler: deleteKaam,
};
