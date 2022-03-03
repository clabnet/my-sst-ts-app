import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // scope.stage; // "dev"
    // scope.region; // "us-west-2"
    // scope.name; // "my-sst-ts-app"

    // Create the Dynamodb table
    const table = new sst.Table(this, "Notes", {
      fields: {
        userId: sst.TableFieldType.STRING,
        noteId: sst.TableFieldType.STRING
      },
      primaryIndex: {
        partitionKey: "userId", sortKey: "noteId"
      }
    })

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        timeout: 60, // increase timeout so we can debug
        environment: {
          tableName: table.dynamodbTable.tableName,
        },
      },
      routes: {
        "GET  /": "src/lambda.handler",
        "GET  /hello": "src/hello.handler", // new endpoint handler
        "GET  /notes": "src/notes/getAll.handler",  // get all notes for userId
        "GET  /notes/{noteId}": "src/notes/get.handler", // get specific noteId
        "POST /notes": "src/notes/create.handler"  // create note
      },
    });

    // grant the permissions to our api to access the table
    api.attachPermissions([table])

    // Show the endpoint in the output
    this.addOutputs({
      "ApiEndpoint": api.url,
    });
  }
}
