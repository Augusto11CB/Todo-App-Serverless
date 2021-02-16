import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodoTask } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing get TODO event: ', event)

  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  const item = await getTodoTask(userId, todoId)

  if (item.length === 0){
    logger.info('Incorrect ID: ', todoId)
    return {
        statusCode: 404,
        body: 'todoId does not exist'
      }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      item
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)