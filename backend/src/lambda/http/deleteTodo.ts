import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { removeTodoTask } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getTodoTask } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('deleteTodo')

// DONE: Remove a TODO item by id
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing delete event: ', event)
  logger.info('Started Proccess to Delete todoId: ', event)
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  // Verify todo existance in database
  const item = await getTodoTask(userId, todoId)

  if (item.length === 0) {
    logger.info('Invalid ID: ', todoId)
    return {
      statusCode: 404,
      body: 'todoId not found'
    }
  }
  await removeTodoTask(userId, todoId)

  return {
    statusCode: 200,
    body: ''
  }

})

handler.use(
  cors({
    credentials: true
  })
)
