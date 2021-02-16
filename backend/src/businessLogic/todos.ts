import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoDataLayerService } from '../dataLayer/todosDataLayerService'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoDataLayerService = new TodoDataLayerService()

export async function getTodoTask(userId: string, todoId: string): Promise<TodoItem[]>{
    return todoDataLayerService.getTodoTask(userId, todoId)
}

export async function createTodoTask(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem>{
    const createdAt = new Date().toISOString()
    const todoId = uuid.v4()
    return await todoDataLayerService.createTodoTask({
        userId,
        todoId,
        createdAt,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
    })
}

export async function updateTodoTask(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string): Promise<TodoItem>{
    return await todoDataLayerService.updateTodoTask({
        userId,
        todoId,
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    })
}

export async function getAllTodosTasks(userId: string): Promise<TodoItem[]>{
    return todoDataLayerService.getAllTodosTasks(userId)
}

export async function removeTodoTask(userId: string, todoId: string){
    return await todoDataLayerService.removeTodoTask(userId, todoId)
}

export async function updateTodoUrl(updateTodo, userId: string, todoId: string): Promise<TodoItem>{
    return await todoDataLayerService.updateTodoUrl({
        userId,
        todoId,
        attachmentUrl: updateTodo.attachmentUrl,
    })
}