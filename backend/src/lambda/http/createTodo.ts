import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { createTodoTask } from '../../businessLogic/todos'

const logger = createLogger('createTodo')

// DONE: Implement creating a new TODO item  
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing create for event: ', event)

  const userId = getUserId(event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const newItem = await createTodoTask(newTodo, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
