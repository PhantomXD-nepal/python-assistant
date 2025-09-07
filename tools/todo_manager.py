
import json

class TodoManager:
    def __init__(self, file_path='todos.json'):
        self.file_path = file_path
        self.todos = self.load_todos()

    def load_todos(self):
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def save_todos(self):
        with open(self.file_path, 'w') as f:
            json.dump(self.todos, f, indent=4)

    def add_todo(self, task):
        self.todos.append({"task": task, "completed": False})
        self.save_todos()

    def remove_todo(self, index):
        if 0 <= index < len(self.todos):
            del self.todos[index]
            self.save_todos()

    def complete_todo(self, index):
        if 0 <= index < len(self.todos):
            self.todos[index]["completed"] = True
            self.save_todos()

    def list_todos(self):
        if not self.todos:
            return "No todos found."
        return "\n".join([f"{i+1}. [{'x' if todo['completed'] else ' '}]{todo['task']}" for i, todo in enumerate(self.todos)])
