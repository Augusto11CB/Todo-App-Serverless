// import 'source-map-support/register'
// import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
// import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { updateTodoTask } from '../../businessLogic/todos'
import { getTodoTask } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('updateTodo')

// DONE: Update a TODO item with the provided id using values in the "updatedTodo" object  
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing update todo event: ', event)

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const item = await getTodoTask(userId, todoId)
  if (item.length === 0) {
    return {
      statusCode: 404,
      body: 'todoId does not exist'
    }
  }

  const items = await updateTodoTask(updatedTodo, userId, todoId)
  return {
    statusCode: 200,
    body: JSON.stringify(items)
  }

})

handler.use(
  cors({
    credentials: true
  })
)