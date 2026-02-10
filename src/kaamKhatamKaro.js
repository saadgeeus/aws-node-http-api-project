"use strict";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const kaamKhatamkaro = async (event) => {
  try {
    const { completed } = JSON.parse(event.body);
    const { id } = event.pathParameters;

    const result = await dynamoDb.send(new UpdateCommand({
      TableName: "KaamKaro",
      Key: { id },
      UpdateExpression: "set completed = :completed",
      ExpressionAttributeValues: { ":completed": completed },
      ReturnValues: "ALL_NEW"
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        msg: "Kaam Khatam Kar Diya",
        updatedItem: result.Attributes 
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

module.exports = {
  handler: kaamKhatamkaro,
};
