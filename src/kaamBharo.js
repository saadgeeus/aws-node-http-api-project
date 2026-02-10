"use strict";
const { v4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const kaamBharo = async (event) => {
  const body = JSON.parse(event.body);
  const createdAt = new Date().toISOString();

  // Agar body aik array hai to loop chalaye ga, warna single object ko array mein wrap kar dega
  const itemsToProcess = Array.isArray(body) ? body : [body];

  try {
    const promises = itemsToProcess.map(async (item) => {
      const newKaam = {
        id: v4(),
        kaam: item.kaam, // Yahan se har item ka kaam nikal raha hai
        createdAt,
        completed: false
      };

      await dynamoDb.send(new PutCommand({
        TableName: "KaamKaro",
        Item: newKaam
      }));

      return newKaam;
    });

    // Saare items ko aik saath save karega
    const savedItems = await Promise.all(promises);

    return {
      statusCode: 200,
      body: JSON.stringify(savedItems),
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Kuch masla ho gaya!", error: err.message }),
    };
  }
};

module.exports = {
  handler: kaamBharo,
};
