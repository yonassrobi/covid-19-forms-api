"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
// const uuid = require("uuid/v4");
const { v4 } = require("uuid");

const postsTable = process.env.POSTS_TABLE;
const travelersTable = process.env.TRAVELERS_TABLE;

// Create a response
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(message)
  };
}
function sortByDate(a, b) {
  if (a.createdAt > b.createdAt) {
    return -1;
  } else return 1;
}
// Create a post
module.exports.createPost = async (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const post = {
    id: v4(),
    ...reqBody
  };

  try {
    const data = await db.put({
      TableName: postsTable,
      Item: post
    });

    return response(201, data);
  } catch (error) {
    console.log(error);
  }

  // return db
  //   .put({
  //     TableName: postsTable,
  //     Item: post
  //   })
  //   .promise()
  //   .then(() => {
  //     callback(null, response(201, post));
  //   })
  //   .catch(err => response(null, response(err.statusCode, err)));
};
// Get all posts
module.exports.getAllPosts = (event, context, callback) => {
  return db
    .scan({
      TableName: postsTable
    })
    .promise()
    .then(res => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch(err => callback(null, response(err.statusCode, err)));
};
// Get number of posts
module.exports.getPosts = (event, context, callback) => {
  const numberOfPosts = event.pathParameters.number;
  const params = {
    TableName: postsTable,
    Limit: numberOfPosts
  };
  return db
    .scan(params)
    .promise()
    .then(res => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch(err => callback(null, response(err.statusCode, err)));
};
// Get a single post
module.exports.getPost = (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id: id
    },
    TableName: postsTable
  };

  return db
    .get(params)
    .promise()
    .then(res => {
      if (res.Item) callback(null, response(200, res.Item));
      else callback(null, response(404, { error: "Post not found" }));
    })
    .catch(err => callback(null, response(err.statusCode, err)));
};
// Update a post
module.exports.updatePost = (event, context, callback) => {
  const id = event.pathParameters.id;
  const reqBody = JSON.parse(event.body);
  const { body, title } = reqBody;

  const params = {
    Key: {
      id: id
    },
    TableName: postsTable,
    ConditionExpression: "attribute_exists(id)",
    UpdateExpression: "SET title = :title, body = :body",
    ExpressionAttributeValues: {
      ":title": title,
      ":body": body
    },
    ReturnValues: "ALL_NEW"
  };
  console.log("Updating");

  return db
    .update(params)
    .promise()
    .then(res => {
      console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch(err => callback(null, response(err.statusCode, err)));
};
// Delete a post
module.exports.deletePost = (event, context, callback) => {
  const id = event.pathParameters.id;
  const params = {
    Key: {
      id: id
    },
    TableName: postsTable
  };
  return db
    .delete(params)
    .promise()
    .then(() =>
      callback(null, response(200, { message: "Post deleted successfully" }))
    )
    .catch(err => callback(null, response(err.statusCode, err)));
};

// Travelers
// Create a post
module.exports.createTraveler = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const post = {
    id: v4(),
    ...reqBody
  };

  return db
    .put({
      TableName: travelersTable,
      Item: post
    })
    .promise()
    .then(() => {
      callback(null, response(201, post));
    })
    .catch(err => response(null, response(err.statusCode, err)));
};
// Get all posts
module.exports.getAllTravelers = (event, context, callback) => {
  return db
    .scan({
      TableName: travelersTable
    })
    .promise()
    .then(res => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch(err => callback(null, response(err.statusCode, err)));
};
// Get number of posts
module.exports.getTravelers = (event, context, callback) => {
  const numberOfPosts = event.pathParameters.number;
  const params = {
    TableName: travelersTable,
    Limit: numberOfPosts
  };
  return db
    .scan(params)
    .promise()
    .then(res => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch(err => callback(null, response(err.statusCode, err)));
};
// Get a single post
module.exports.getTraveler = (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id: id
    },
    TableName: travelersTable
  };

  return db
    .get(params)
    .promise()
    .then(res => {
      if (res.Item) callback(null, response(200, res.Item));
      else callback(null, response(404, { error: "Post not found" }));
    })
    .catch(err => callback(null, response(err.statusCode, err)));
};
// Update a post
module.exports.updateTraveler = (event, context, callback) => {
  const id = event.pathParameters.id;
  const reqBody = JSON.parse(event.body);
  const { body, title } = reqBody;

  const params = {
    Key: {
      id: id
    },
    TableName: travelersTable,
    ConditionExpression: "attribute_exists(id)",
    UpdateExpression: "SET title = :title, body = :body",
    ExpressionAttributeValues: {
      ":title": title,
      ":body": body
    },
    ReturnValues: "ALL_NEW"
  };
  console.log("Updating");

  return db
    .update(params)
    .promise()
    .then(res => {
      console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch(err => callback(null, response(err.statusCode, err)));
};
// Delete a post
module.exports.deleteTraveler = (event, context, callback) => {
  const id = event.pathParameters.id;
  const params = {
    Key: {
      id: id
    },
    TableName: travelersTable
  };
  return db
    .delete(params)
    .promise()
    .then(() =>
      callback(null, response(200, { message: "Post deleted successfully" }))
    )
    .catch(err => callback(null, response(err.statusCode, err)));
};
