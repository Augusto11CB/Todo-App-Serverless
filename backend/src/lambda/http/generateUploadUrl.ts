import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateTodoUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import * as AWSXRay from 'aws-xray-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHEMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const logger = createLogger('deleteTodo')

// DONE: Return a presigned URL to upload a file for a TODO item with the provided id
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing generation of presigned URL for event: ', event)
  
  const todoId = event.pathParameters.todoId
  
  // Update dynamoDb with Url
  const uploadUrl = getURLToUpload(todoId)
  const userId = getUserId(event)
  const updatedTodo = {
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }

  await updateTodoUrl(updatedTodo, userId, todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
})

function getURLToUpload(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}

handler.use(
  cors({
    credentials: true
  })
)
